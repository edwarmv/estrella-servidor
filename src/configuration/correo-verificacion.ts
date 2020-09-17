export const htmlVerificacion: (nombreCompleto: string, url: string) => string =
  (nombreCompleto: string, url: string ) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div
          class="container"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Roboto', sans-serif;
          "
        >

          <div
            class="inner-container"
            style="
              max-width: 500px;
              min-width: 500px;
              margin-top: 20px;
              background-color: #f8f5ec;
              border-radius: 5px 5px 5px 5px;
              -webkit-box-shadow: 0px 0px 11px 3px rgba(0,0,0,0.41);
              -moz-box-shadow: 0px 0px 11px 3px rgba(0,0,0,0.41);
              box-shadow: 0px 0px 11px 3px rgba(0,0,0,0.41);
            "
          >

            <div
              class="logo"
              style="
                background-color: #10ae2e;
                padding: 20px;
                display: flex;
                justify-content: center;
                border-radius: 5px 5px 0 0;
              "
            >
              <img style="width: 200px" src="https://i.imgur.com/nqamObS.png" alt="logo">
            </div>

            <div
              class="main-content"
              style="
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
              "
            >
              <p>Hola ${nombreCompleto}, por favor para verificar tu cuenta haz click en el enlace de abajo.</p>
              <a
                class="verificar"
                style="margin: 40px;"
                href="${url}"
              >
                Verificar cuenta
              </a>
            </div>

            <div
              class="footer"
              style="padding: 20px;"
            >
              <p
                class="bold"
                style="font-weight: bold;"
              >
                Números de contacto:
              </p>
              <p>Teléfono: 66-40056</p>
              <p>Celular: 76189658</p>
              <p
                class="bold"
                style="font-weight: bold;"
              >
                Dirección:
              </p>
              <p>Barra Tabladita - Avenida 6 de agosto y Calle Entre Ríos</p>
            </div>

          </div>

        </div>
      </body>
    </html>
  `;
  return html;
};
