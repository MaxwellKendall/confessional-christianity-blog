import { ImageResponse } from "@vercel/og"
import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions"
import path from "path"

export const config = {
  runtime: "experimental-edge",
}

// Make sure the font exists in the specified path:
const font = fetch(
  // new URL("../../assets/Cinzel-VariableFont_wght.ttf", import.meta.url)
  path.resolve(__dirname, "../../../assets/Cinzel-Regular.ttf")
).then(res => res.arrayBuffer())

const handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const searchParams = event.queryStringParameters || {}
    const fontData = await font
    const hasTitle = !!searchParams.subTitle
    const subTitle = hasTitle
      ? searchParams?.subTitle?.slice(0, 100)
      : "My default title"

    const hasQuery = !!searchParams.query
    const query = hasQuery
      ? searchParams?.query?.slice(0, 100)
      : "My default query"

    return {
      statusCode: 200,
      body: new ImageResponse(
        (
          <div
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
              {hasQuery && (
                <p
                  style={{
                    fontSize: "36px",
                    fontStyle: "italic",
                    margin: "25px",
                  }}
                >
                  {query}
                </p>
              )}
            </div>
          </div>
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
      ),
    }
  } catch (e) {
    throw e
  }
}

export default handler
