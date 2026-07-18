import { adminDb } from './_firebase-admin.mjs';

export async function handler(event){
  try{
    const id=String(event.queryStringParameters?.id||'').trim();
    if(!/^[A-Za-z0-9_-]{1,128}$/.test(id))return {statusCode:400,body:'Invalid image ID'};
    const snapshot=await adminDb.collection('galleryItems').doc(id).get();const data=snapshot.data();
    if(!snapshot.exists||!data?.custom||!data.imageData||data.deleted||data.active===false)return {statusCode:404,body:'Image not found'};
    return {statusCode:200,isBase64Encoded:true,headers:{'Content-Type':data.mimeType||'image/webp','Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff'},body:data.imageData};
  }catch(error){console.error('gallery-image error',error);return {statusCode:500,body:'Image unavailable'};}
}
