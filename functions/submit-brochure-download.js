export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  try {
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, phone, company } = await context.request.json();

    // Validate required fields
    if (!name || !phone || !company) {
      return new Response(
        JSON.stringify({ error: "All fields are required: name, phone, company" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate input lengths
    if (name.length > 100 || phone.length > 20 || company.length > 100) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum length" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Texsonics Downloads <contact@texsonics.net>",
        to: ["dharmar@texsonics.net"],
        subject: `New Brochure Download Request from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a365d; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">
              📥 New Brochure Download Request
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f7fafc; font-weight: bold; width: 30%;">Name</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f7fafc; font-weight: bold;">Phone</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f7fafc; font-weight: bold;">Company</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${company}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f7fafc; font-weight: bold;">Downloaded</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">Texsonics Company Brochure</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f7fafc; font-weight: bold;">Time</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${timestamp}</td>
              </tr>
            </table>
            
            <p style="color: #718096; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              This is an automated notification from the Texsonics website.
            </p>
          </div>
        `,
      }),
    });

    const responseData = await resendResponse.json();
    console.log("Resend API response:", responseData);

    if (!resendResponse.ok) {
      console.error("Resend API error:", responseData);
      return new Response(
        JSON.stringify({ error: "Failed to send notification email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error processing brochure download request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}
