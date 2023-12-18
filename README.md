# Nodejs server for the payment form in webview - Izipay

## Requirements
* Nodejs v20 or higher

## Configuration
1. 
```sh
npm install
```

2. 
```sh
npm run dev
```

3. Probar la api para crear la url que se incrustará en el webview
```sh
http://localhost:3000/api/init
```

4. Configurar la api de manera publica para recepcionar la respuesta de pago
```sh
http://tudominio.com/api/ipn
```