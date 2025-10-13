export async function getAccessToken(clientId: string, clientSecret: string, code: string): Promise<{ access_token?: string; error?: string; error_description?: string }> {
    const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code
        })
    });

    return response.json();
}
