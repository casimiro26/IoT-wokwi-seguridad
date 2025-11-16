#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Configuración de WiFi
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const int wifiChannel = 6;

// Configuración del servidor
const char* serverUrl = "https://api-app-android-studio-tesis.onrender.com/datos";
const char* token = "FeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Zjk0YmI5MDZjNjJhMTU0MTYyN2Q4MCIsIm5vbWJyZVVzdWFyaW8iOiJSb2JvdDEwIiwiaWF0IjoxNzYyNzg3NzE1LCJleHAiOjE3NjI3OTEzMTV9.EB2XS_Az5msm5w9CPcOkwD1SH_ASx4j8tvOLG2lZpgQ";

// Configuración de pines CORREGIDOS según tu JSON
const int pirPin = 3;    // Pin del sensor PIR (D3 según JSON)
const int ledPin = 12;   // Pin del LED (correcto según JSON)
const int buzzerPin = 14; // Pin del buzzer (D14 según JSON)

// Variables globales
int eventosTotales = 30;
int eventosCriticos = 20;
unsigned long ultimaDeteccion = 0;
unsigned long ultimoSonidoBuzzer = 0;
bool movimientoActivo = false;
bool buzzerSonando = false;

// Función para conectar a WiFi
bool conectarWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    return true;
  }
  Serial.print("Conectando a WiFi...");
  WiFi.begin(ssid, password, wifiChannel);
  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(".");
    intentos++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(" ¡Conectado!");
    Serial.println("IP asignada: " + WiFi.localIP().toString());
    return true;
  } else {
    Serial.println(" Fallo al conectar a WiFi");
    return false;
  }
}

// Función para simular datos
void generarDatosSimulados(int &horas, int &eventosTotalesLocal, int &eventosCriticosLocal, String &movimiento) {
  horas = random(1, 25);
  eventosTotalesLocal = eventosTotales;
  eventosCriticosLocal = eventosCriticos;
  movimiento = movimientoActivo ? "sí" : "no";
}

// Función para activar el buzzer
void activarBuzzer() {
  tone(buzzerPin, 1000); // Activar buzzer con frecuencia 1000 Hz
  buzzerSonando = true;
  ultimoSonidoBuzzer = millis();
  Serial.println("Buzzer ACTIVADO - Movimiento detectado");
}

// Función para desactivar el buzzer
void desactivarBuzzer() {
  noTone(buzzerPin);
  buzzerSonando = false;
  Serial.println("Buzzer DESACTIVADO");
}

void setup() {
  // Configurar pines CORREGIDOS
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  
  // Estado inicial
  digitalWrite(ledPin, LOW);
  digitalWrite(buzzerPin, LOW); // Asegurar que el buzzer esté apagado
  
  Serial.begin(115200);
  Serial.println("Iniciando ESP32...");
  Serial.println("Pines configurados:");
  Serial.println("- PIR: D" + String(pirPin));
  Serial.println("- LED: D" + String(ledPin));
  Serial.println("- Buzzer: D" + String(buzzerPin));

  // Conectar a WiFi
  conectarWiFi();
}

void loop() {
  int pirEstado = digitalRead(pirPin);
  unsigned long tiempoActual = millis();

  // Solo mostrar estado del PIR ocasionalmente para no saturar el monitor serial
  static unsigned long ultimoPrintPIR = 0;
  if (tiempoActual - ultimoPrintPIR >= 2000) {
    Serial.println("Estado PIR: " + String(pirEstado == HIGH ? "Movimiento" : "Sin movimiento"));
    ultimoPrintPIR = tiempoActual;
  }

  if (pirEstado == HIGH) {
    if (!movimientoActivo) {
      movimientoActivo = true;
      eventosTotales++;
      Serial.println("Movimiento detectado! Eventos totales: " + String(eventosTotales));
      digitalWrite(ledPin, HIGH);
      
      // ACTIVAR BUZZER AL DETECTAR MOVIMIENTO
      activarBuzzer();
      ultimaDeteccion = tiempoActual;
    }

    // Verificar evento crítico (movimiento continuo por 2 segundos)
    if (movimientoActivo && (tiempoActual - ultimaDeteccion >= 2000)) {
      eventosCriticos++;
      Serial.println("Evento crítico registrado! Eventos críticos: " + String(eventosCriticos));
      
      // Cambiar frecuencia para evento crítico
      tone(buzzerPin, 1500); // Frecuencia más alta para evento crítico
      ultimaDeteccion = tiempoActual;
    }

    // Mantener el buzzer sonando continuamente mientras hay movimiento
    if (movimientoActivo && !buzzerSonando) {
      activarBuzzer();
    }

  } else {
    if (movimientoActivo) {
      movimientoActivo = false;
      digitalWrite(ledPin, LOW);
      
      // DESACTIVAR BUZZER CUANDO EL MOVIMIENTO TERMINA
      desactivarBuzzer();
      Serial.println("Movimiento terminado.");
    }
  }

  // Enviar datos cada 5 segundos
  static unsigned long ultimoEnvio = 0;
  if (tiempoActual - ultimoEnvio >= 5000) {
    int horas, eventosTotalesLocal, eventosCriticosLocal;
    String movimiento;
    generarDatosSimulados(horas, eventosTotalesLocal, eventosCriticosLocal, movimiento);

    StaticJsonDocument<200> doc;
    doc["horasMonitoreadas"] = horas;
    doc["eventosTotales"] = eventosTotalesLocal;
    doc["eventosCriticos"] = eventosCriticosLocal;
    doc["movimiento"] = movimiento;

    String json;
    serializeJson(doc, json);

    if (conectarWiFi()) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      http.addHeader("Authorization", String("Bearer ") + token);

      Serial.println("Enviando datos: " + json);
      int httpCode = http.POST(json);
      if (httpCode > 0) {
        String response = http.getString();
        Serial.println("Código HTTP: " + String(httpCode));
        Serial.println("Respuesta: " + response);
        if (httpCode == 401 || httpCode == 403) {
          Serial.println("Error: Token inválido o expirado. Actualiza el token.");
        }
      } else {
        Serial.println("Error en la solicitud HTTP: " + String(httpCode));
      }
      http.end();
    } else {
      Serial.println("WiFi no conectado, no se enviaron datos.");
    }

    ultimoEnvio = tiempoActual;
  }

  delay(100);
}