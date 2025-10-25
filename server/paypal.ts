import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
  CheckoutPaymentIntent,
} from "@paypal/paypal-server-sdk";

/* Lazy initialization - only create client when needed */

let ordersController: OrdersController | null = null;
let oAuthAuthorizationController: OAuthAuthorizationController | null = null;
let PAYPAL_CLIENT_ID: string | null = null;
let PAYPAL_CLIENT_SECRET: string | null = null;

function initializePayPal() {
  if (ordersController && oAuthAuthorizationController) {
    return; // Already initialized
  }

  PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || null;
  PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || null;

  if (!PAYPAL_CLIENT_ID) {
    throw new Error("Missing PAYPAL_CLIENT_ID environment variable");
  }
  if (!PAYPAL_CLIENT_SECRET) {
    throw new Error("Missing PAYPAL_CLIENT_SECRET environment variable");
  }

  const paypalMode = process.env.PAYPAL_MODE || (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox');
  const isProduction = paypalMode === 'production';

  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: PAYPAL_CLIENT_ID,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: isProduction ? Environment.Production : Environment.Sandbox,
    logging: isProduction ? {
      logLevel: LogLevel.Error,
      logRequest: { logBody: false },
      logResponse: { logHeaders: false },
    } : {
      logLevel: LogLevel.Info,
      logRequest: { logBody: true },
      logResponse: { logHeaders: true },
    },
  });
  
  ordersController = new OrdersController(client);
  oAuthAuthorizationController = new OAuthAuthorizationController(client);
}

/* Token generation helpers */

export async function getClientToken() {
  initializePayPal();
  
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController!.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

/*  Process transactions */

export async function createPaypalOrder(
  donorName: string,
  donorEmail: string | null,
  amount: number,
  localAmount: number,
  localCurrency: string,
  campaignId: number | null
) {
  try {
    initializePayPal();

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount. Amount must be a positive number.");
    }

    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: amount.toFixed(2),
            },
            description: `Donation to Gift of Hope from ${donorName}`,
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController!.createOrder(collect);
    const jsonResponse = JSON.parse(String(body));

    if (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 201) {
      throw new Error(`PayPal API error: ${JSON.stringify(jsonResponse)}`);
    }

    return jsonResponse;
  } catch (error: any) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

export async function capturePaypalOrder(orderID: string) {
  try {
    initializePayPal();
    
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController!.captureOrder(collect);
    const jsonResponse = JSON.parse(String(body));

    if (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 201) {
      console.error('PayPal capture error:', JSON.stringify(jsonResponse, null, 2));
      throw new Error(`PayPal capture failed: ${JSON.stringify(jsonResponse)}`);
    }

    return jsonResponse;
  } catch (error: any) {
    console.error("Failed to capture order:", error);
    throw error;
  }
}

export async function loadPaypalDefault() {
  try {
    const clientToken = await getClientToken();
    return { clientToken };
  } catch (error: any) {
    console.error("Failed to load PayPal:", error);
    throw error;
  }
}
