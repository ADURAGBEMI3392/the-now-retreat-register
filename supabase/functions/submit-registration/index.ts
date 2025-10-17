import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing registration submission...");
    
    const formData = await req.formData();
    
    // Extract all form fields
    const fullName = formData.get("fullName") as string;
    const gender = formData.get("gender") as string;
    const age = formData.get("age") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const location = formData.get("location") as string;
    const church = formData.get("church") as string || "N/A";
    const affiliation = formData.get("affiliation") as string;
    const howHeard = formData.get("howHeard") as string || "N/A";
    const dramaMINISTRY = formData.get("dramaMINISTRY") as string || "N/A";
    const worshipMinister = formData.get("worshipMinister") as string || "N/A";
    const expectations = formData.get("expectations") as string || "N/A";
    const helpNeeded = formData.get("helpNeeded") as string || "N/A";
    const prayerRequests = formData.get("prayerRequests") as string || "N/A";
    
    const photoFile = formData.get("photo") as File | null;
    
    let photoUrl = "";
    
    // Upload photo to storage if provided
    if (photoFile && photoFile.size > 0) {
      console.log("Uploading photo to storage...");
      
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const fileName = `${Date.now()}_${fullName.replace(/\s+/g, '_')}.${photoFile.name.split('.').pop()}`;
      const photoBuffer = await photoFile.arrayBuffer();
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('retreat-photos')
        .upload(fileName, photoBuffer, {
          contentType: photoFile.type,
          upsert: false
        });
      
      if (uploadError) {
        console.error("Photo upload error:", uploadError);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('retreat-photos')
          .getPublicUrl(fileName);
        photoUrl = publicUrl;
        console.log("Photo uploaded successfully:", photoUrl);
      }
    }
    
    // Build email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #d4af37 0%, #8b4513 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🕊️ New Registration</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">ELOHIM'S BIBLE STUDY RETREAT: Renewing of Minds</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ${photoUrl ? `
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${photoUrl}" alt="${fullName}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid #d4af37;" />
            </div>
          ` : ''}
          
          <h2 style="color: #8b4513; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 0;">Personal Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">Full Name:</td>
              <td style="padding: 8px 0; color: #333;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Gender:</td>
              <td style="padding: 8px 0; color: #333;">${gender}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Age:</td>
              <td style="padding: 8px 0; color: #333;">${age}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Phone/WhatsApp:</td>
              <td style="padding: 8px 0; color: #333;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; color: #333;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Location/City:</td>
              <td style="padding: 8px 0; color: #333;">${location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Church/Ministry:</td>
              <td style="padding: 8px 0; color: #333;">${church}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Affiliation:</td>
              <td style="padding: 8px 0; color: #333;">${affiliation}</td>
            </tr>
          </table>
          
          <h2 style="color: #8b4513; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Spiritual Section</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold; width: 40%;">How did you hear about us?</td>
              <td style="padding: 8px 0; color: #333;">${howHeard}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Serve in Drama Ministry?</td>
              <td style="padding: 8px 0; color: #333;">${dramaMINISTRY}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Worship Minister?</td>
              <td style="padding: 8px 0; color: #333;">${worshipMinister}</td>
            </tr>
          </table>
          
          <h2 style="color: #8b4513; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Expectations & Prayer</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p style="color: #666; font-weight: bold; margin: 0 0 8px 0;">Spiritual Expectations:</p>
            <p style="color: #333; margin: 0; white-space: pre-wrap;">${expectations}</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p style="color: #666; font-weight: bold; margin: 0 0 8px 0;">How can we help your coming?</p>
            <p style="color: #333; margin: 0; white-space: pre-wrap;">${helpNeeded}</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
            <p style="color: #666; font-weight: bold; margin: 0 0 8px 0;">Prayer Requests:</p>
            <p style="color: #333; margin: 0; white-space: pre-wrap;">${prayerRequests}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
            <p>Submitted on ${new Date().toLocaleString('en-US', { 
              dateStyle: 'full', 
              timeStyle: 'short' 
            })}</p>
          </div>
        </div>
      </div>
    `;
    
    // Send email to admin
    console.log("Sending email notification...");
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "ELOHIM'S Retreat <onboarding@resend.dev>",
      to: ["oraclesofgod.e@gmail.com"],
      subject: "🕊️ New Registration — ELOHIM'S BIBLE STUDY RETREAT: Renewing of Minds",
      html: emailHtml,
    });
    
    if (emailError) {
      console.error("Email sending error:", emailError);
      throw emailError;
    }
    
    console.log("Email sent successfully:", emailData);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Registration submitted successfully",
        photoUrl 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-registration function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
