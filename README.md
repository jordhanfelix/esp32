# ESP32 + Frontend para automação rural e irrigação

Este projeto nasceu de uma solução de automação agrícola desenvolvida como parte de um Trabalho de Conclusão de Curso em 2022. A ideia central era integrar um controlador embarcado com uma interface web simples para gerenciar dispositivos elétricos e sistemas de irrigação em ambiente rural.

A arquitetura combina firmware em C++ para ESP32 com um frontend em JavaScript para configuração, monitoramento e acionamento de relés. O objetivo era permitir que o operador realizasse tarefas de automação diretamente pela rede local, sem depender de uma infraestrutura complexa ou de um backend centralizado.

## Contexto do projeto

O uso principal e mais relevante do sistema foi a irrigação de café em uma fazenda real em Fundão, no Espírito Santo. Nesse cenário, o sistema foi aplicado como controlador de irrigação, permitindo ligar e desligar bombas, programar horários e, com a integração de sensores de solo, contribuir para o monitoramento mais eficiente do uso da água.

A lógica era simples, porém prática: economizar água, reduzir desperdícios e evitar irrigação desnecessária, acionando o sistema apenas quando as condições de umidade e programação indicavam necessidade. Esse uso real mostrou a utilidade do projeto como automatizador de campo, especialmente em áreas agrícolas onde a eficiência do uso da água impacta diretamente os custos e a produtividade.

## Aplicações comprovadas e potenciais

### Uso comprovado

- Irrigação de café em fazenda real em Fundão/ES
- Automação de bombas de água
- Monitoramento de umidade do solo com sensores externos
- Programação de horários de irrigação para evitar desperdícios
- Redução de consumo de água em operação agrícola de campo

### Possíveis usos do sistema

Além da irrigação, a mesma arquitetura pode ser adaptada para diversas aplicações agrícolas e de automação local:

- Controle de bombas para irrigação por gotejamento, pivô central ou microaspersão
- Abertura e fechamento de portões de acesso para gado ou veículos
- Acionamento de válvulas de água, drenagem e fertilização
- Automação de iluminação e ventilação em estufas
- Controle de motores e bombas em poços, caixas d'água e reservatórios
- Alarme e monitoramento de áreas rurais com sensores externos
- Ativação de sistemas de irrigação em sementeiras, viveiros e pomares

Em outras palavras, a plataforma funciona como um controlador/automatizador de campo para tarefas repetitivas e críticas, sendo especialmente útil em ambientes rurais onde a automação precisa ser simples, robusta e acessível.

## Arquitetura geral

- Firmware em C++ para ESP32
- Web server local usando `ESPAsyncWebServer`
- Configuração via Wi‑Fi em modo Access Point quando necessário
- Interface web para configuração de rede e acionamento de relés
- Persistência em SPIFFS para salvar configuração
- Comunicação direta entre navegador e ESP32 via rede local

## Requisitos

- Placa ESP32
- Arduino IDE ou arduino-cli
- Bibliotecas:
  - `ESPAsyncWebServer`
  - `AsyncTCP`
  - `SimpleDHT`
- Node.js e npm para execução do frontend em modo de desenvolvimento

## 1. Carregar o firmware no ESP32

1. Abra o arquivo `esp32.ino` no Arduino IDE.
2. Instale as bibliotecas necessárias se ainda não estiverem disponíveis.
3. Selecione a placa correta: `ESP32 Dev Module`.
4. Configure a porta serial do ESP32.
5. Compile e faça o upload do firmware.

## 2. Configurar Wi‑Fi do ESP32

Na primeira inicialização, se o ESP32 não tiver credenciais salvas, ele entra em modo Access Point com o nome `ESP-WIFI-MANAGER`.

1. Conecte o computador ao Wi‑Fi do ESP32.
2. Acesse a página de configuração em `http://192.168.4.1`.
3. Informe:
   - SSID
   - Senha
   - Endereço IP estático
   - Gateway
4. Salve a configuração.
5. O ESP32 reinicia e tenta conectar na rede configurada.

> Não grave senhas reais em arquivos versionados nem compartilhe credenciais em documentação pública.

## 3. Executar o frontend

Se você quiser usar a interface web em modo de desenvolvimento:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Depois, acesse a URL exibida no terminal.

## 4. Conectar o frontend ao ESP32

O frontend tenta se conectar diretamente ao ESP32 usando a configuração salva em `localStorage` e o IP informado na rede.

O valor usado é salvo em:

```js
localStorage.setItem('@ESP:baseUrl', 'http://192.168.1.200');
```

Em geral, o processo é:

1. Abrir a página de rede no frontend.
2. Informar o IP e gateway do ESP32.
3. Salvar as configurações.
4. O navegador passa a chamar as rotas do ESP32 diretamente em `http://<IP_DO_ESP32>`.

## 5. Rotas esperadas pelo firmware

O ESP32 aceita as seguintes chamadas HTTP:

- `POST /config` para salvar SSID, senha, IP e gateway
- `POST /control/:pin/:action` para ligar/desligar relés
- `GET /status` para consultar status do módulo

As respostas do firmware devem seguir o formato JSON com `ok` e `message` (ou dados em JSON). O frontend foi ajustado para interpretar esse padrão.

## 6. Testes de funcionamento

1. Acesse a página de configuração da rede.
2. Salve o SSID, senha e IP do ESP32.
3. Verifique se o ESP32 conecta na rede e se o navegador consegue acessar `http://<IP_DO_ESP32>`.
4. Abra a tela de controles.
5. Crie um controle e salve.
6. Confirme se o ESP32 responde corretamente ao comando de liga/desliga.
7. Verifique logs seriais com `Serial Monitor` para confirmar a execução do firmware.

## 7. Diagnóstico de problemas comuns

- Falha de conexão Wi‑Fi: confirmar SSID e senha, e verificar se o IP informado está dentro da mesma faixa da rede.
- Página não carrega: confirmar se o ESP32 está conectado à rede e se o navegador está apontando para o IP correto.
- Requisições sem resposta: verificar se o firmware está ativo e se a rota HTTP está sendo chamada corretamente.
- `CORS`: não é necessário em uma arquitetura direta navegador ↔ ESP32, porque o navegador acessa o ESP32 diretamente.
- Firmware não responde: verificar se a biblioteca `ESPAsyncWebServer` está instalada e se o ESP32 foi flashado com o código correto.

## Observação importante

Este ambiente de validação não possui `Node.js`, `npm` nem `arduino-cli` instalados, então a compilação do frontend e do firmware não pôde ser executada aqui. O que foi verificado foi a consistência das rotas e dos parâmetros do protocolo de integração no código do projeto.

## Conclusão

O projeto representa um exemplo concreto de automação agrícola acessível, com foco em irrigação, controle local e redução de desperdício. Sua evolução natural é para uma plataforma de automação de propriedades rurais, com sensores de solo, acionamento de bombas, válvulas e integradores de rotina de irrigação, sem exigir uma infraestrutura web complexa ou custo elevado.
