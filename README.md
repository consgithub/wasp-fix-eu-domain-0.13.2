# Mailgun EU Domain Fix for Wasp 0.13.2

A fix to enable Mailgun EU domain support in Wasp 0.13.2 applications before official support was added.

## Problem

Wasp 0.13.2 doesn't support Mailgun EU domains (`api.eu.mailgun.net`), causing email delivery failures for projects using EU-based Mailgun accounts. This fix adds that missing functionality.

## Solution

This module creates a custom Mailgun configuration that specifies the EU API endpoint, allowing emails to be sent successfully from EU-hosted Mailgun accounts.

## Usage

1. Copy `mailguneu.ts` to your Wasp project (typically in `src/server/`)

2. Configure environment variables in your `.env.server` file:

```env
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your-domain.com
```

3. Define your Wasp context types (if you haven't already):

``` typescript
// Example context type definitions for Wasp
type Context = {
  entities: {
    // Your entity definitions here
    Email: {
      create: (args: { data: { address: string } }) => Promise<any>;
      findFirst: (args: { where: { address: string } }) => Promise<any>;
    };
    EmailSendLog: {
      count: (args: { where: any }) => Promise<number>;
      create: (args: { data: any }) => Promise<any>;
    }
    // Other entities...
  }
}

type EmailInput = {
  address: string;
}
```

4. Use the sendCustomEmail function in your Wasp actions:

``` typescript
// Example: In a Wasp action file (e.g., src/server/actions.ts)
import { sendCustomEmail } from './mailguneu';
import { HttpError } from 'wasp/server';

export const sendEmailAction = async (
  { address }: EmailInput,
  context: Context
) => {
  if (!address) {
    throw new HttpError(400, 'Email address is required.');
  }
  
  try {
    // Use the EU-enabled email function
    await sendCustomEmail(
      address,
      "Your Email Subject",
      yourEmailTemplate({ /* template variables */ })
    );
    
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
  
  return { success: true };
};
```

## What's the fix?

The key change is adding the EU API endpoint:

``` typescript
customMailer.options = {
    host: 'api.eu.mailgun.net'
};
```

## Important Notes

Wasp Version: This fix is specifically for Wasp 0.13.2  
Update Path: Official EU domain support was added in later Wasp versions (0.15+)  
Alternative Solution: Upgrade to Wasp 0.15+ for native EU domain support