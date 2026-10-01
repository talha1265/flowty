import crypto from 'crypto';

export interface PayUHashParams {
  key: string;
  txnid: string;
  amount: string | number;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  salt: string;
}

export interface PayUVerifyParams {
  status: string;
  email: string;
  firstname: string;
  productinfo: string;
  amount: string | number;
  txnid: string;
  key: string;
  salt: string;
  receivedHash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
}

/**
 * Generate PayU SHA-512 payment hash
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePayUHash(params: PayUHashParams): string {
  const formattedAmount = typeof params.amount === 'number' 
    ? params.amount.toFixed(2) 
    : parseFloat(params.amount).toFixed(2);

  const hashString = [
    params.key,
    params.txnid,
    formattedAmount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || '',
    params.udf2 || '',
    params.udf3 || '',
    params.udf4 || '',
    params.udf5 || '',
    '', '', '', '', '', // 5 empty pipes
    params.salt
  ].join('|');

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Verify PayU response reverse hash
 * Formula: sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 * Or with additionalCharges: sha512(additionalCharges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUHash(params: PayUVerifyParams): boolean {
  const formattedAmount = typeof params.amount === 'number' 
    ? params.amount.toFixed(2) 
    : parseFloat(params.amount).toFixed(2);

  // Standard reverse hash
  const reverseComponents = [
    params.salt,
    params.status,
    '', '', '', '', '', // 5 empty pipes
    params.udf5 || '',
    params.udf4 || '',
    params.udf3 || '',
    params.udf2 || '',
    params.udf1 || '',
    params.email,
    params.firstname,
    params.productinfo,
    formattedAmount,
    params.txnid,
    params.key
  ];

  if (params.additionalCharges) {
    reverseComponents.unshift(params.additionalCharges);
  }

  const calculatedHash = crypto
    .createHash('sha512')
    .update(reverseComponents.join('|'))
    .digest('hex');

  // Secure constant-time comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(calculatedHash.toLowerCase()),
      Buffer.from(params.receivedHash.toLowerCase())
    );
  } catch {
    return calculatedHash.toLowerCase() === params.receivedHash.toLowerCase();
  }
}

/**
 * Get PayU checkout gateway URL based on environment
 */
export function getPayUEndpoint(): string {
  const mode = process.env.PAYU_MODE || 'test';
  if (mode === 'prod') {
    return 'https://secure.payu.in/_payment';
  }
  return 'https://test.payu.in/_payment';
}

/**
 * Generates unique transaction ID for PayU
 */
export function generateTxnId(prefix: string = 'FLW'): string {
  const timestamp = Date.now().toString(36);
  const randomHex = crypto.randomBytes(4).toString('hex');
  return `${prefix}_${timestamp}_${randomHex}`.toUpperCase();
}
