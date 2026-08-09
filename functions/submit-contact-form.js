export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
    console.log('Contact form submission received');
    
    // Check if API key exists
    if (!context.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const { name, email, phone, company, message } = await context.request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Sending email for: ${name} (${email})`);

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Texsonics Contact Form <contact@texsonics.net>',
        to: ['dharmar@texsonics.net'],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 12px;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold;">Email:</td>
              <td style="padding: 12px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold;">Phone:</td>
              <td style="padding: 12px;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; font-weight: bold;">Company:</td>
              <td style="padding: 12px;">${company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 12px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        `,
      }),
    });

    const responseData = await resendResponse.json();
    console.log('Resend API response:', JSON.stringify(responseData));

    if (!resendResponse.ok) {
      console.error('Resend API error:', responseData);
      return new Response(
        JSON.stringify({ error: responseData.message || 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('Email sent successfully');
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
