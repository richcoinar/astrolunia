export type Plan = 'free' | 'premium';
export type Feature = 'chart'|'horoscope'|'ai';
export const planLimits = {free:{aiPerMonth:3,chartsPerMonth:3},premium:{aiPerMonth:100,chartsPerMonth:200}} as const;
export function isAdmin(appMetadata:Record<string,unknown>|undefined) {return appMetadata?.astrolunia_role==='admin';}
export function isPremium(plan:Plan, validUntil:string|null,now=new Date()) {return plan==='premium' && !!validUntil && new Date(validUntil).getTime()>now.getTime();}
export function effectivePlan(plan:Plan|undefined,validUntil:string|null|undefined,now=new Date()):Plan {return plan && isPremium(plan,validUntil??null,now)?'premium':'free';}
