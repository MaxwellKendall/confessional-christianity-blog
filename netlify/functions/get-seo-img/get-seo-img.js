// const { ImageResponse } = require("@vercel/og");
// const path = require('path')
// const fetch = require('node-fetch');

import { ImageResponse } from "@vercel/og";
import path from 'path'
import fetch from 'node-fetch';

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
// const handler = async (event) => {
//   try {
//     const subject = event.queryStringParameters.name || 'World'
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: `Hello ${subject}` }),
//       // // more keys you can return:
//       // headers: { "headerName": "headerValue", ... },
//       // isBase64Encoded: true,
//     }
//   } catch (error) {
//     return { statusCode: 500, body: error.toString() }
//   }
// }

// module.exports = { handler }


const config = {
  runtime: "experimental-edge",
};

// const fontPath = path.resolve(__dirname, '../../assets/Cinzel-Regular.tff');
// Make sure the font exists in the specified path:
const font = fetch(
  // new URL("../../assets/Cinzel-VariableFont_wght.ttf", import.meta.url)
  new URL("../../assets/Cinzel-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

// Make sure the font exists in the specified path:
// const font = fetch(fontPath).then((res) => res.arrayBuffer());

const handler = async function (event) {
  try {
    const searchParams = event.queryStringParameters;
    const fontData = await font;
    const hasTitle = searchParams.has("subTitle");
    const subTitle = hasTitle
      ? searchParams.get("subTitle")?.slice(0, 100)
      : "My default title";

    const hasQuery = searchParams.has("query");
    const query = hasQuery
      ? searchParams.get("query")?.slice(0, 100)
      : "My default query";

    return new ImageResponse(
      (
        `<div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            fontFamily: "Cinzel",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1 style={{ fontSize: "64px", textAlign: "center" }}>
              Confessional Christianity
            </h1>
            <p
              style={{
                display: "flex",
                flexWrap: "wrap",
                textAlign: "center",
                justifySelf: "center",
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                margin: "25px",
                fontSize: "48px",
              }}
            >
              {subTitle}
            </p>
          </div>
        </div>`
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Cinzel",
            data: fontData,
            style: "normal",
          },
        ],
        headers: {
          "content-type": "image/png",
          "cache-control": "no-cache",
        },
      }
    );
  } catch (e) {
    throw e;
  }
}

// module.exports = {
//   handler
// }

export default { handler };