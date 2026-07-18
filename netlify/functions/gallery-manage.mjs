import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, requireAdmin, response } from './_firebase-admin.mjs';
import { defaultGalleryItems } from './_gallery-data.mjs';

const clean=(value,max=120)=>String(value??'').trim().slice(0,max);
const isMaster=(profile)=>profile.role==='admin'&&clean(profile.roll,30).toUpperCase()==='ADMIN-01';
const imagePayload=(body)=>{
  if(!body.imageData)return {};
  const mimeType=['image/jpeg','image/png','image/webp'].includes(body.mimeType)?body.mimeType:'image/webp';
  const imageData=String(body.imageData).replace(/^data:image\/[a-z0-9.+-]+;base64,/i,'');
  if(!/^[A-Za-z0-9+/=]+$/.test(imageData)||Buffer.byteLength(imageData,'base64')>800000)throw Object.assign(new Error('Compressed image maximum 800 KB हो सकती है।'),{status:400});
  return {imageData,mimeType};
};
const publicItem=(id,data)=>{const {imageData,...safe}=data;return {id,...safe,src:data.custom?`/.netlify/functions/gallery-image?id=${encodeURIComponent(id)}`:data.src};};

export async function handler(event){
  try{
    const collection=adminDb.collection('galleryItems');
    if(event.httpMethod==='GET'){
      const snapshot=await collection.get();
      const overrides=new Map(snapshot.docs.map(doc=>[doc.id,doc.data()]));
      const items=defaultGalleryItems.map(item=>publicItem(item.id,{...item,...(overrides.get(item.id)||{})}));
      snapshot.docs.forEach(doc=>{if(!defaultGalleryItems.some(item=>item.id===doc.id))items.push(publicItem(doc.id,doc.data()));});
      return response(200,{items:items.filter(item=>!item.deleted).sort((a,b)=>String(a.batch).localeCompare(String(b.batch))||Number(a.order)-Number(b.order))});
    }
    const admin=await requireAdmin(event);
    if(!isMaster(admin))return response(403,{error:'Gallery केवल ADMIN-01 owner manage कर सकता है।'});
    const body=JSON.parse(event.body||'{}');
    const data={fileName:clean(body.fileName,120),caption:clean(body.caption,120),batch:clean(body.batch,60)||'School Gallery',folder:clean(body.folder,60)||'general',order:Number.isFinite(Number(body.order))?Number(body.order):999,active:body.active!==false,updatedBy:admin.uid,updatedAt:FieldValue.serverTimestamp()};
    if(event.httpMethod==='POST'){
      const image=imagePayload(body);if(!image.imageData)return response(400,{error:'नई gallery item के लिए image required है।'});
      const reference=collection.doc();await reference.set({...data,...image,custom:true,createdAt:FieldValue.serverTimestamp()});return response(201,{id:reference.id});
    }
    const id=clean(body.id,128);if(!id)return response(400,{error:'Gallery item ID required.'});
    if(event.httpMethod==='PUT'){await collection.doc(id).set({...data,...imagePayload(body)},{merge:true});return response(200,{id});}
    if(event.httpMethod==='DELETE'){
      const isDefault=defaultGalleryItems.some(item=>item.id===id);
      if(isDefault)await collection.doc(id).set({deleted:true,updatedBy:admin.uid,updatedAt:FieldValue.serverTimestamp()},{merge:true});else await collection.doc(id).delete();
      return response(200,{id});
    }
    return response(405,{error:'Method not allowed.'});
  }catch(error){console.error('gallery-manage error',error);return response(error.status||500,{error:error.message||'Server error.'});}
}
