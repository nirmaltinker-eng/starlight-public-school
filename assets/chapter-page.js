(function(){
  const params=new URLSearchParams(location.search),className=params.get('class')||'10',subject=params.get('subject')||'Science',index=Number(params.get('chapter')||0);
  const chapters=window.NOTES_DATA[className].subjects[subject]||window.NOTES_DATA[className].subjects.Science;
  const item=chapters[index]||chapters[0];
  document.title=item[0]+' - Starlight Public School';
  document.querySelector('#lesson-title').textContent=item[0];
  document.querySelector('#subject-name').textContent=`Class ${className} ${subject}`;
  document.querySelector('#summary').textContent=item[1];
  document.querySelector('#back-link').href=subject.toLowerCase().replace(/\s+/g,'-')+'/'+subject.toLowerCase().replace(/\s+/g,'-')+'-notes.html';
  const keyPoints = item[2] || [
    `Core idea: ${item[1]}`,
    "मुख्य परिभाषाएँ, नियम और महत्वपूर्ण शब्द अपनी कॉपी में लिखें।",
    "जहाँ आवश्यक हो वहाँ सूत्र, उदाहरण या labelled diagram बनाएँ।",
    "Textbook के प्रश्न और chapter-based practice questions हल करें।"
  ];
  document.querySelector('#key-points').innerHTML=keyPoints.map((point)=>`<li>${point}</li>`).join('');
  document.querySelector('#concept-chart').innerHTML=`<div><b>पहले समझें</b><span>${item[0]}</span></div><i>→</i><div><b>मुख्य अवधारणा</b><span>${item[1]}</span></div><i>→</i><div><b>अभ्यास</b><span>परिभाषा, उदाहरण और 5 प्रश्न</span></div>`;
  const video=window.CHAPTER_VIDEOS?.get(className,subject,index);
  const frame=document.querySelector('#chapter-video');
  if(video){frame.src=video}else{frame.closest('.video-wrap').hidden=true}
})();
