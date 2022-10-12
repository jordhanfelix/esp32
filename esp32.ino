/*********
  Rui Santos
  Complete instructions at https://RandomNerdTutorials.com/esp32-wi-fi-manager-asyncwebserver/

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*********/

#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <AsyncTCP.h>
#include <SimpleDHT.h>
#include <Wire.h>
#include <FS.h>
#include "SPIFFS.h"

#define endereço I2C do MCP23017
#define MCP_ADDRESS 0x20
// ENDEREÇOS DE REGISTRADORES
#define GPA 0x12                  // DATA PORT REGISTER A
#define GPB 0x13                  // DATA PORT REGISTER B
#define IODIRA 0x00               // I/O DIRECTION REGISTER A
#define IODIRB 0x01               // I/O DIRECTION REGISTER B
#define PINS_COUNT 16             // Quantidade total de pinos
#define DATA_PATH "/pin_data.bin" // Arquivo onde serão salvos os status dos pinos
#define DHTPIN 5                  // Pino one está o DHT22

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Objeto que faz a leitura da temperatura e umidade
SimpleDHT22 dht;

// Search for parameter in HTTP POST request
const char* PARAM_INPUT_1 = "ssid";
const char* PARAM_INPUT_2 = "pass";
const char* PARAM_INPUT_3 = "ip";
const char* PARAM_INPUT_4 = "gateway";

//Buttons
const char* PARAM_BTN_1 = "btn_1";
const char* PARAM_BTN_2 = "btn_2";
const char* PARAM_BTN_3 = "btn_3";
const char* PARAM_BTN_4 = "btn_4";
const char* PARAM_BTN_5 = "btn_5";
const char* PARAM_BTN_6 = "btn_6";
const char* PARAM_BTN_7 = "btn_7";
const char* PARAM_BTN_8 = "btn_8";
const char* PARAM_BTN_9 = "btn_9";
const char* PARAM_BTN_10 = "btn_10";
const char* PARAM_BTN_11 = "btn_11";
const char* PARAM_BTN_12 = "btn_12";
const char* PARAM_BTN_13 = "btn_13";
const char* PARAM_BTN_14 = "btn_14";
const char* PARAM_BTN_15 = "btn_15";
const char* PARAM_BTN_16 = "btn_16";

// Variáveis para guardar os valores de temperatura e umidade lidos
float temperature = 0;
float humidity = 0;

// Guarda o estado atual das duas portas do MCP23017 (8 bits cada)
uint8_t currentValueGPA = 0;
uint8_t currentValueGPB = 0;

// faz o controle do temporizador do watchdog (interrupção por tempo)
hw_timer_t *timer = NULL;

//Variables to save values from HTML form
String ssid;
String pass;
String ip;
String gateway;
String btn_one;
String btn_two;
String btn_three;
String btn_four;
String btn_five;
String btn_six;
String btn_seven;
String btn_eight;
String btn_nine;
String btn_ten;
String btn_eleven;
String btn_twelve;
String btn_thirteen;
String btn_fourteen;
String btn_fifteen;
String btn_sixteen;

// File paths to save input values permanently
const char* ssidPath = "/ssid.txt";
const char* passPath = "/pass.txt";
const char* ipPath = "/ip.txt";
const char* gatewayPath = "/gateway.txt";

const char* btnOnePath = "/btn_1.txt";
const char* btnTwoPath = "/btn_2.txt";
const char* btnThreePath = "/btn_3.txt";
const char* btnFourPath = "/btn_4.txt";
const char* btnFivePath = "/btn_5.txt";
const char* btnSixPath = "/btn_6.txt";
const char* btnSevenPath = "/btn_7.txt";
const char* btnEightPath = "/btn_8.txt";
const char* btnNinePath = "/btn_9.txt";
const char* btnTenPath = "/btn_10.txt";
const char* btnElevenPath = "/btn_11.txt";
const char* btnTwelvePath = "/btn_12.txt";
const char* btnThirteenPath = "/btn_13.txt";
const char* btnFourteenPath = "/btn_14.txt";
const char* btnFifteenPath = "/btn_15.txt";
const char* btnSixteenPath = "/btn_16.txt";

IPAddress localIP;
//IPAddress localIP(192, 168, 1, 200); // hardcoded

// Set your Gateway IP address
IPAddress localGateway;
//IPAddress localGateway(192, 168, 1, 1); //hardcoded
IPAddress subnet(255, 255, 0, 0);

// Timer variables
unsigned long previousMillis = 0;
const long interval = 10000;  // interval to wait for Wi-Fi connection (milliseconds)

// Set LED GPIO
const int ledPin = 2;
// Stores LED state

String ledState;

// Initialize SPIFFS
void initSPIFFS() {
  if (!SPIFFS.begin(true)) {
    Serial.println("An error has occurred while mounting SPIFFS");
  }
  loadPinStatus();
  Serial.println("SPIFFS mounted successfully");
}

// Read File from SPIFFS
String readFile(fs::FS &fs, const char * path) {
  Serial.printf("Reading file: %s\r\n", path);

  File file = fs.open(path);
  if (!file || file.isDirectory()) {
    Serial.println("- failed to open file for reading");
    return String();
  }

  String fileContent;
  while (file.available()) {
    fileContent = file.readStringUntil('\n');
    break;
  }
  return fileContent;
}

// Write file to SPIFFS
void writeFile(fs::FS &fs, const char * path, const char * message) {
  Serial.printf("Writing file: %s\r\n", path);

  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    Serial.println("- failed to open file for writing");
    return;
  }
  if (file.print(message)) {
    Serial.println("- file written");
  } else {
    Serial.println("- frite failed");
  }
}

// Initialize WiFi
bool initWiFi() {
  if (ssid == "" || ip == "") {
    Serial.println("Undefined SSID or IP address.");
    return false;
  }

  WiFi.mode(WIFI_STA);
  localIP.fromString(ip.c_str());
  localGateway.fromString(gateway.c_str());


  if (!WiFi.config(localIP, localGateway, subnet)) {
    Serial.println("STA Failed to configure");
    return false;
  }
  WiFi.begin(ssid.c_str(), pass.c_str());
  Serial.println("Connecting to WiFi...");

  unsigned long currentMillis = millis();
  previousMillis = currentMillis;

  while (WiFi.status() != WL_CONNECTED) {
    currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      Serial.println("Failed to connect.");
      return false;
    }
  }

  Serial.println(WiFi.localIP());
  return true;
}

// Replaces placeholder with LED state value
String processor(const String& var) {
  if (var == "STATE") {
    if (digitalRead(ledPin)) {
      ledState = "ON";
    }
    else {
      ledState = "OFF";
    }
    return ledState;
  }
  return String();
}

// função que configura o temporizador
void setupWatchdog()
{
  timer = timerBegin(0, 80, true); // timerID 0, div 80
  // timer, callback, interrupção de borda
  timerAttachInterrupt(timer, &resetModule, true);
  // timer, tempo (us), repetição
  timerAlarmWrite(timer, 5000000, true);
  timerAlarmEnable(timer); // habilita a interrupção //enable interrupt
}

void loop()
{
  // reseta o temporizador (alimenta o watchdog)
  timerWrite(timer, 0);
  // Verifica se existe alguma requisição
  server.handleClient();
}

void loadPinStatus()
{
  // Abre o arquivo para leitura
  File file = SPIFFS.open(DATA_PATH, FILE_READ);

  // Se arquivo não existe
  if (!file)
  {
    // Na primeira vez o arquivo ainda não foi criado
    Serial.println("Failed to open file for reading");
    // Coloca todos os pinos das duas portas do MCP23017 em LOW
    writeBlockData(GPA, B00000000);
    writeBlockData(GPB, B00000000);
    return;
  }

  // Faz a leitura dos valores
  file.read(&currentValueGPA, 1);
  file.read(&currentValueGPB, 1);
  // fecha o arquivo
  file.close();

  // Envia os valores para o MCP23017
  writeBlockData(GPA, currentValueGPA);
  writeBlockData(GPB, currentValueGPB);
}

// função que o temporizador irá chamar, para reiniciar o ESP32
void IRAM_ATTR resetModule()
{
  ets_printf("(watchdog) reboot\n");
  esp_restart();//reinicia o chip
}

void handleNotFound()
{
  // Envia para o navegador a informação que a rota não foi encontrada
  server.send(404, "text/plain", "Not Found");
}

// Executada a ação junto ao valor (número do relê)
void execute(String action, String value)
{
  // Se é uma das duas ações que esperamos
  if (action == "on" || action == "off")
  {
    // Os relês são numerados a partir do 1, mas o array começa do 0
    // então tiramos 1
    int index = value.toInt() - 1;
    int status = action == "on" ? HIGH : LOW;
    digitalWriteMCP(index, status);
  }
}

//Verifica status do pino
uint8_t getPinStatus(int pin)
{
  uint8_t v;

  // de 0 a 7 porta A, de 8 a 15 porta B
  if (pin < 8)
  {
    v = currentValueGPA;
  }
  else
  {
    v = currentValueGPB;
    pin -= 8;
  }

  return !!(v & (1 << pin));
}

// Configura o modo dos pinos das portas (GPA ou GPB)
// como parametro passamos:
//   port: GPA ou GPB
//   type:
//     INPUT para todos os pinos da porta trabalharem como entrada
//     OUTPUT para todos os pinos da porta trabalharem como saída
void configurePort(uint8_t port, uint8_t type)
{
  if (type == INPUT)
  {
    writeBlockData(port, 0xFF);
  }
  else if (type == OUTPUT)
  {
    writeBlockData(port, 0x00);
  }
}

// muda o estado de um pino desejado
void digitalWriteMCP(int pin, int value)
{
  uint8_t port;
  uint8_t v;

  // de 0 a 7 porta A, de 8 a 15 porta B
  if (pin < 8)
  {
    port = GPA;
    v = currentValueGPA;
  }
  else
  {
    port = GPB;
    v = currentValueGPB;
    pin -= 8;
  }

  if (value == LOW)
  {
    v &= ~(B00000001 << (pin)); // muda o pino para LOW
  }
  else if (value == HIGH)
  {
    v |= (B00000001 << (pin)); // muda o pino para HIGH
  }

  // Salva os valores dos bits da porta correspondente
  if (port == GPA)
  {
    currentValueGPA = v;
  }
  else
  {
    currentValueGPB = v;
  }

  // envia os dados para o MCP
  writeBlockData(port, v);
}

// envia dados para o MCP23017 através do barramento i2c
void writeBlockData(uint8_t port, uint8_t data)
{
  Wire.beginTransmission(MCP_ADDRESS);
  Wire.write(port);
  Wire.write(data);
  Wire.endTransmission();
  delay(10);
}

// Faz a leitura da temperatura e umidade
void readDHT()
{
  float t, h;
  int status = dht.read2(DHTPIN, &t, &h, NULL);

  // Apenas altera as variáveis se a leitura foi bem sucedida
  if (status == SimpleDHTErrSuccess)
  {
    temperature = t;
    humidity = h;
  }
}

void setupPins()
{
  // Inicializa o Wire nos pinos SDA e SCL padrões do ESP32
  Wire.begin();
  // Velocidade de comunicação
  Wire.setClock(200000);

  // Configura todos os pinos das duas portas do MCP23017 como saída
  configurePort(IODIRA, OUTPUT);
  configurePort(IODIRB, OUTPUT);
}

void setup() {
  // Serial port for debugging purposes
  Serial.begin(115200);

  initSPIFFS();

  // Inicializa os valores dos pinos do MCP23017
  setupPins();

  // Set GPIO 2 as an OUTPUT
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  // Load values saved in SPIFFS
  ssid = readFile(SPIFFS, ssidPath);
  pass = readFile(SPIFFS, passPath);
  ip = readFile(SPIFFS, ipPath);
  gateway = readFile (SPIFFS, gatewayPath);
  Serial.println(ssid);
  Serial.println(pass);
  Serial.println(ip);
  Serial.println(gateway);

  if (initWiFi()) {
    // Route for root / web page
    server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
      request->send(SPIFFS, "/index.html", "text/html", false, processor);
    });
    server.serveStatic("/", SPIFFS, "/");

    // Route to set GPIO state to HIGH
    server.on("/on", HTTP_GET, [](AsyncWebServerRequest * request) {
      digitalWrite(ledPin, HIGH);
      request->send(SPIFFS, "/index.html", "text/html", false, processor);
    });

    // Route to set GPIO state to LOW
    server.on("/off", HTTP_GET, [](AsyncWebServerRequest * request) {
      digitalWrite(ledPin, LOW);
      request->send(SPIFFS, "/index.html", "text/html", false, processor);
    });
    server.begin();
  }
  else {
    // Connect to Wi-Fi network with SSID and password
    Serial.println("Setting AP (Access Point)");
    // NULL sets an open Access Point
    WiFi.softAP("ESP-WIFI-MANAGER", NULL);

    IPAddress IP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.println(IP);

    // Web Server Root URL
    server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
      request->send(SPIFFS, "/wifimanager.html", "text/html");
    });

    server.serveStatic("/", SPIFFS, "/");

    server.on("/", HTTP_POST, [](AsyncWebServerRequest * request) {
      int params = request->params();
      for (int i = 0; i < params; i++) {
        AsyncWebParameter* p = request->getParam(i);
        if (p->isPost()) {
          // HTTP POST ssid value
          if (p->name() == PARAM_INPUT_1) {
            ssid = p->value().c_str();
            Serial.print("SSID set to: ");
            Serial.println(ssid);
            // Write file to save value
            writeFile(SPIFFS, ssidPath, ssid.c_str());
          }
          // HTTP POST pass value
          if (p->name() == PARAM_INPUT_2) {
            pass = p->value().c_str();
            Serial.print("Password set to: ");
            Serial.println(pass);
            // Write file to save value
            writeFile(SPIFFS, passPath, pass.c_str());
          }
          // HTTP POST ip value
          if (p->name() == PARAM_INPUT_3) {
            ip = p->value().c_str();
            Serial.print("IP Address set to: ");
            Serial.println(ip);
            // Write file to save value
            writeFile(SPIFFS, ipPath, ip.c_str());
          }
          // HTTP POST gateway value
          if (p->name() == PARAM_INPUT_4) {
            gateway = p->value().c_str();
            Serial.print("Gateway set to: ");
            Serial.println(gateway);
            // Write file to save value
            writeFile(SPIFFS, gatewayPath, gateway.c_str());
          }
          //Serial.printf("POST[%s]: %s\n", p->name().c_str(), p->value().c_str());
        }
      }
      request->send(200, "text/plain", "Salvo. reiniciando ESP, conecte-se ao IP: " + ip);
      delay(3000);
      ESP.restart();
    });//Fim função de configuração de rede via HTML

    server.begin();
  }

  // Inicializa o watchdog
  setupWatchdog();

}

void loop() {

}
