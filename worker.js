export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'apikey, authorization, content-type, content-profile, prefer, x-client-info',
        },
      });
    }

    const targetUrl = `https://db.vhcapsgwemepzvlubtdy.supabase.co${url.pathname}${url.search}`;

    const forwardHeaders = new Headers();
    const headersToForward = ['apikey', 'authorization', 'content-type', 'content-profile', 'prefer', 'x-client-info'];
    for (const header of headersToForward) {
      const value = request.headers.get(header);
      if (value) forwardHeaders.set(header, value);
    }

    const fetchOptions = {
      method: request.method,
      headers: forwardHeaders,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = request.body;
    }

    const response = await fetch(targetUrl, fetchOptions);

    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'apikey, authorization, content-type, content-profile, prefer, x-client-info');

    return newResponse;
  },
};
