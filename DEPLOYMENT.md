# Deployment Guide for Portfolio Wallet DApp

## Environment Variables Setup

### For Vercel Deployment:

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add the following variables:**

```
NEXT_PUBLIC_COVALENT_API_KEY=cqt_rQbj8ftxpC6tb3fDgfj3FJfmpYT3
NEXT_PUBLIC_ALCHEMY_ID=7tjk3OYyTbjnNI6HpW7-X
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=7385803c8f2f73899156256e346a7d00
```

### For Other Platforms:

Make sure to set these environment variables in your deployment platform:

- **Netlify**: Site Settings → Environment Variables
- **Railway**: Variables tab
- **Heroku**: Settings → Config Vars
- **AWS**: Environment Variables in your deployment configuration

## Important Notes:

1. **NEXT_PUBLIC_ prefix**: All environment variables that need to be accessible in the browser must start with `NEXT_PUBLIC_`

2. **Redeploy**: After adding environment variables, you need to redeploy your application

3. **API Key Security**: The Covalent API key is safe to expose in the browser (it's designed for frontend use)

## Troubleshooting:

### If you see "API Status: Not configured":
- Check that environment variables are set in your deployment platform
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables

### If you see "No Tokens Found":
- Check browser console for detailed API debugging info
- Verify your wallet has tokens on the correct network
- Ensure the Covalent API key is valid

### Debug Information:
The app now includes comprehensive debugging. Check the browser console for:
- API key status
- Network requests
- Token data received
- Any error messages

## Testing:

1. Deploy with environment variables
2. Connect your wallet
3. Check browser console for debug info
4. Verify tokens appear correctly
