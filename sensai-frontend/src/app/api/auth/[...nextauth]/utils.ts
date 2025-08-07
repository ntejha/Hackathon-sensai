/**
 * Server-side utility functions for authentication
 */

interface UserData {
  email: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  image?: string;
  id?: string;
}

interface AccountData {
  access_token?: string;
  id_token?: string;
  provider?: string;
}

/**
 * Send user authentication data to the backend after successful Google login
 * This is a server-side implementation for NextAuth callbacks
 */
export async function registerUserWithBackend(
  user: UserData,
  account: AccountData
): Promise<any> {
  try {
    // Validate required data
    if (!user.email || !account.id_token) {
      console.error('Missing required authentication data:', { 
        hasEmail: !!user.email, 
        hasIdToken: !!account.id_token 
      });
      return { id: null, error: 'Missing required authentication data' };
    }
    
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        given_name: user.given_name || user.name?.split(' ')[0] || '',
        family_name: user.family_name || user.name?.split(' ').slice(1).join(' ') || '',
        id_token: account.id_token
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend auth failed: ${response.status} - ${errorText}`);
      throw new Error(`Backend auth failed: ${response.status} - ${errorText}`);
    }

    // Return the raw response data - assuming it contains an 'id' field directly
    const data = await response.json();
    
    // Make sure the ID exists and is returned properly
    if (!data.id) {
      console.error("Backend response missing ID field:", data);
      return { id: null, error: 'Backend response missing ID field' };
    }
    
    console.log('Successfully registered user with backend:', data.id);
    return data;
  } catch (error) {
    console.error('Backend authentication error:', error);
    // Don't throw error to prevent blocking the auth flow
    // Just log it and continue
    return { id: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 