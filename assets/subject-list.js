(function(){
  const className=document.body.dataset.class||'10',subject=document.body.dataset.subject;
  const entry=window.NOTES_DATA[className].subjects[subject]||[];
  document.querySelector('#subject-title').textContent=`Class ${className} ${subject} Notes`;
  document.querySelector('#chapter-list').innerHTML=entry.map((item,index)=>`<li><a href="../chapter.html?class=${className}&subject=${encodeURIComponent(subject)}&chapter=${index}"><span class="chapter-number">Chapter ${index+1}</span>${item[0]}</a></li>`).join('');
})();
