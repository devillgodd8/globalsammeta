// Wait for both jQuery and DOM to be ready
$(document).ready(function () {
    console.log('jQuery ready - part.js loaded');

    const assemblySelect = document.getElementById('part_name');
    if (assemblySelect) {
        assemblySelect.replaceChildren(
            new Option('Select Engine or Transmission', ''),
            new Option('Engine', 'Engine'),
            new Option('Transmission', 'Transmission')
        );
    }

    $('#quoteTermsConsent').on('change', function () {
        if ($(this).is(':checked')) {
            $('#quoteTermsConsentError').hide();
            $(this).css('outline', 'none');
        }
    });

    // Form visual feedback functionality
    $('#model').change(function () {
        $('.model-f').css('border-bottom', '1px solid #ccc');
    });

    $('#part_name').change(function () {
        // Add styling for part selection if needed
    });

    $('#year').change(function () {
        $('.year-f').css('border-bottom', '1px solid #ccc');
    });

});

$('#regForm select').click(function () {
    var selectId = $(this).attr('id');

    // Updated validation logic to match the actual form structure
    if (selectId === 'part_name') {
        let model = $("#model").val();
        if (model === "") {
            $('.model-f').css('border-bottom', '1px solid red');
        }
    } else if (selectId === 'year') {
        let model = $("#model").val();
        if (model === "") {
            $('.model-f').css('border-bottom', '1px solid red');
        }
    }
});

// Function to create HTML table format for email
function createEmailTableContent(data) {
    var currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    var tableHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #04003f; color: white; padding: 20px; text-align: center;">
                <h2>Engine or Transmission Quote Request</h2>
                <p>Submitted on: ${currentDate}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Field</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #f8f9fa; font-weight: bold;">Customer Name</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">${data.name || 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #f8f9fa; font-weight: bold;">Email Address</td>
                        <td style="border: 1px solid #ddd; padding: 12px;"><a href="mailto:${data.email}">${data.email || 'Not provided'}</a></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #f8f9fa; font-weight: bold;">Contact Number</td>
                        <td style="border: 1px solid #ddd; padding: 12px;"><a href="tel:${data.mobile}">${data.mobile || 'Not provided'}</a></td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #f8f9fa; font-weight: bold;">ZIP Code</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">${data.zip_code || 'Not provided'}</td>
                    </tr>
                    <tr style="background-color: #e3f2fd;">
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #1976d2; color: white; font-weight: bold;">Vehicle Year</td>
                        <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">${data.year || 'Not provided'}</td>
                    </tr>
                    <tr style="background-color: #e3f2fd;">
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #1976d2; color: white; font-weight: bold;">Vehicle Model</td>
                        <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">${data.model || 'Not provided'}</td>
                    </tr>
                    <tr style="background-color: #e3f2fd;">
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #1976d2; color: white; font-weight: bold;">Part Needed</td>
                        <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">${data.part_name || 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #f8f9fa; font-weight: bold;">Purchase Timeline</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">${data.purchase || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #f8f9fa; font-weight: bold;">Vehicle VIN</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">${data.vin || 'Not provided'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; background-color: #f8f9fa; font-weight: bold;">Additional Comments</td>
                        <td style="border: 1px solid #ddd; padding: 12px;">${data.comment || 'No additional comments'}</td>
                    </tr>
                </tbody>
            </table>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin-top: 20px; text-align: center;">
                <p><strong>Next Steps:</strong></p>
                <p>Please contact the customer within 24 hours with a quote and availability information.</p>
                <p style="color: #666; font-size: 12px;">This email was automatically generated from the reveraforteauto.com quote request form.</p>
            </div>
        </div>
    `;

    return tableHtml;
}

// Function to send email (using a simple mailto approach for static sites)
function sendEmail(formData, subject, body) {
    // For a static website, we'll use a combination of approaches

    // Method 1: Try using EmailJS if configured
    if (typeof emailjs !== 'undefined') {
        // EmailJS configuration - you would need to set this up
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            to_email: 'info@globalsamautos.com',
            subject: subject,
            message: body,
            from_name: formData.name,
            from_email: formData.email,
            reply_to: formData.email
        }).then(function (response) {
            $('#loader').hide();
            showSuccessMessage();
        }, function (error) {
            console.log('EmailJS error:', error);
            fallbackEmailMethod(formData, subject, body);
        });
    } else {
        // Fallback method
        fallbackEmailMethod(formData, subject, body);
    }
}

// Fallback email method using AJAX to send data to server-side script
function fallbackEmailMethod(formData, subject, body) {
    // Send form data via AJAX to PHP script
    $.ajax({
        url: 'send_email.php',
        type: 'POST',
        data: {
            year: formData.year,
            model: formData.model,
            part_name: formData.part_name,
            purchase: formData.purchase,
            vin: formData.vin,
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            zip_code: formData.zip_code,
            comment: formData.comment,
            email_subject: subject,
            email_body: body,
            to_email: 'info@globalsamautos.com'
        },
        timeout: 30000, // 30 second timeout
        success: function (response) {
            $('#loader').hide();
            try {
                var result = JSON.parse(response);
                if (result.success) {
                    showSuccessMessage();
                } else {
                    showErrorMessage('Failed to send email: ' + (result.error || 'Unknown error'));
                }
            } catch (e) {
                // If response is not JSON, check if it contains success indicators
                if (response.toLowerCase().includes('success') || response.toLowerCase().includes('sent')) {
                    showSuccessMessage();
                } else {
                    showErrorMessage('Email sent but received unexpected response format.');
                }
            }
        },
        error: function (xhr, status, error) {
            $('#loader').hide();
            var errorMsg = 'Failed to send email. ';

            if (status === 'timeout') {
                errorMsg += 'Request timed out. Please try again.';
            } else if (xhr.status === 0) {
                errorMsg += 'Network connection error. Please check your connection.';
            } else if (xhr.status === 404) {
                errorMsg += 'Email service not found. Please contact support.';
            } else if (xhr.status >= 500) {
                errorMsg += 'Server error. Please try again later.';
            } else {
                errorMsg += 'Error: ' + error;
            }

            showErrorMessage(errorMsg);
        }
    });
}

// Function to show success message
function showSuccessMessage() {
    // Reset form
    $('#regForm')[0].reset();

    // Reset field styling
    $('.input-field').css('border-bottom', '1px solid #ccc');
    $('.year-f').css('border-bottom', '1px solid #ccc');
    $('.model-f').css('border-bottom', '1px solid #ccc');

    // Show success message
    var successHtml = `
        <div class="success-message" style="background-color: #d4edda; color: #155724; padding: 20px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3>Thank you for your request</h3>
            <p><strong>Your engine or transmission quote request has been submitted.</strong></p>
            <p>Our team will review the vehicle and assembly details you provided and follow up with next steps.</p>
            <ul style="text-align: left; display: inline-block;">
                <li>Fitment details for the requested assembly</li>
                <li>Quote information, when available</li>
                <li>Order and delivery next steps</li>
            </ul>
            <p><strong>Need assistance?</strong><br>
            Call us at <a href="tel:+1307200080" style="color: #155724; font-weight: bold;">+1 (307) 200-0080</a></p>
        </div>
    `;

    // Insert success message after the form
    $('#regForm').after(successHtml);

    // Scroll to success message
    $('html, body').animate({
        scrollTop: $('#regForm').offset().top - 50
    }, 1000);

    // Remove success message after 10 seconds
    setTimeout(function () {
        $('.success-message, .error-message').fadeOut(500, function () {
            $(this).remove();
        });
    }, 10000);
}

// Function to show error message
function showErrorMessage(message) {
    // Show error message
    var errorHtml = `
        <div class="error-message" style="background-color: #f8d7da; color: #721c24; padding: 20px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h3>❌ Submission Error</h3>
            <p><strong>We encountered an issue while processing your request.</strong></p>
            <p>${message}</p>
            <p><strong>Please try again or contact us directly:</strong><br>
            Call us at <a href="tel:+1307200080" style="color: #721c24; font-weight: bold;">+1 (307) 302-8308</a><br>
            Email us at <a href="mailto:info@globalsamautos.com" style="color: #721c24; font-weight: bold;">info@globalsamautos.com</a></p>
        </div>
    `;

    // Remove any existing messages first
    $('.success-message, .error-message').remove();

    // Insert error message after the form
    $('#regForm').after(errorHtml);

    // Scroll to error message
    $('html, body').animate({
        scrollTop: $('#regForm').offset().top - 50
    }, 1000);

    // Remove error message after 15 seconds
    setTimeout(function () {
        $('.error-message').fadeOut(500, function () {
            $(this).remove();
        });
    }, 15000);
}

// Clear field styling when user starts typing/selecting
$('#regForm input, #regForm select').on('focus change', function () {
    $(this).closest('.input-field').css('border-bottom', '1px solid #ccc');
});