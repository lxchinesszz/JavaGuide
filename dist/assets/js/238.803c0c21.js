(window.webpackJsonp=window.webpackJsonp||[]).push([[238],{441:function(t,e,a){},557:function(t,e,a){"use strict";a(441)},606:function(t,e,a){"use strict";a.r(e);var r={name:"Ring",data:()=>({clouds:50,particles:300,particleArray:[],shootingParticles:100,shootingParticlesArray:[],ringNumber:8,stylesArray:[],ringArray:[],instances:4,count:300,countArray:[],start:65,then:Date.now(),displayModeEngage:Date.now(),displayMode:!1,angles:[[0,25,10,"rgba(255,255,255,1)"],[50,76,10,"rgba(255,255,255,1)"],[101,126,10,"rgba(255,255,255,1)"],[152,177,10,"rgba(255,255,255,1)"],[203,227,10,"rgba(255,255,255,1)"],[258,279,10,"rgba(255,255,255,1)"],[305,334,10,"rgba(255,255,255,1)"]]}),methods:{changeDisplay(){this.displayMode=!this.displayMode,this.displayModeEngage=Date.now()},loop(){let t=Date.now();this.then;this.update(),this.render(),this.then=t,requestAnimationFrame(this.loop)},update(){!1===this.displayMode?(this.start=this.start+.2,this.start>=100&&(this.changeDisplay(),this.start=100)):(this.start=this.start-.4,this.start<=0&&(this.changeDisplay(),this.start=0)),this.particleArray.forEach((t,e)=>{this.adjustLength(t),this.moveParticle(t)}),this.shootingParticlesArray.forEach((t,e)=>{this.moveShootingParticle(t)}),this.ringArray.forEach((t,e)=>{this.updateRings(t)}),this.countArray.forEach((t,e)=>{this.updateCount(t)})},render(){let t=document.getElementById("coreCanvas"),e=document.getElementById("firstCanvas"),a=document.getElementById("secondCanvas"),r=document.getElementById("shootingParticles"),i=t.getContext("2d"),s=e.getContext("2d"),o=a.getContext("2d"),n=r.getContext("2d");i.globalCompositeOperation="screen",n.globalCompositeOperation="screen",i.clearRect(0,0,t.width,t.height),this.particleArray.forEach((t,e)=>{this.renderParticle(t,i)}),s.clearRect(0,0,e.width,e.height),this.drawCircularPlate(this.angles,s),o.clearRect(0,0,a.width,a.height),this.countArray.forEach((t,e)=>{this.drawCounter(t,o)}),this.drawShootTime(this.start,o),this.drawOuterRing(this.ringArray,o),n.clearRect(0,0,r.width,r.height),this.shootingParticlesArray.forEach((t,e)=>{this.renderShootingParticles(t,n)})},createShootingParticles(t){for(let e=0;e<t;e++){let t={x:470,y:12*Math.random()-6+95,radius:5*Math.random()+15,speed:7*Math.random()+1,opacity:1,delay:Math.floor(1e3*Math.random())};this.shootingParticlesArray.push(t)}},drawCounterInitiation(t){for(let e=0;e<t;e++){let a={number:e,opacity:Math.random(),reverse:!0,start:e*(360/t),finish:(e+1)*(360/t),fill:"transparent",shadow:"rgba(255,255,255,0.5)",strokeStyle:"255,255,255",lineWidth:Math.floor(5*Math.random()+3)};this.countArray.push(a)}},drawShootTime(t,e){let a=3.6*t-90;e.strokeStyle="rgba(255,255,255,"+t/100+")",e.beginPath(),e.arc(225,225,185,Math.PI/180*-90,a*(Math.PI/180)),e.stroke(),e.closePath();let r=185*Math.cos((a+5)*Math.PI/180)+225,i=185*Math.sin((a+5)*Math.PI/180)+225;e.fillStyle="white",e.textAlign="center",e.font="10px Arial",e.fillText(t.toString().substring(0,2)+"%",r,i)},updateCount(t){!0===t.reverse&&(t.opacity-=.01,t.opacity<.1&&(t.reverse=!1)),!1===t.reverse&&(t.opacity+=.01,t.opacity>.9&&(t.reverse=!0))},drawCounter(t,e){t.number%2&&(e.beginPath(),e.strokeStyle="rgba("+t.strokeStyle+","+t.opacity+")",e.arc(225,225,215+t.lineWidth/2,t.start*(Math.PI/180),t.finish*(Math.PI/180)),e.fillStyle=t.fill,e.fill(),e.shadowColor=t.shadow,e.shadowBlur=8,e.lineWidth=t.lineWidth,e.strokeStyle=1,e.stroke(),e.closePath())},createCoreParticles(t){for(let e=0;e<t;e++){let t=Math.floor(360*Math.random()),a=Math.floor(25*Math.random()),r=80+40*Math.random(),i=Math.random()-.5;i=i>.3?.3:i;let s={x:250+(r+a*Math.cos(t*(Math.PI/180))),y:250+(r+a*Math.sin(t*(Math.PI/180))),radius:2*Math.random()+2,startRadius:2*Math.random()+2,length:r,speed:i,usedLength:r,grow:Math.random()>.5,startAngle:t,number:e,usedAngle:t,ring:a,color:Math.random()>.5?"rgba(255, 255, 255,0.3)":"rgba(214,107,24,0.3)",shadow:"rgba(0, 0, 0,1)",number:e};this.particleArray.push(s)}},makeStarStyles(t){if(null===document.getElementById("cloud-"+t)){let t=Math.floor(230*Math.random()+130),e="position:absolute;"+("top:"+Math.floor(Math.random()*document.body.clientHeight-t/2)+"px")+";"+("left:"+Math.floor(Math.random()*document.body.clientWidth-t/2)+"px")+";height:"+t+"px;width:"+t+"px;border-radius:180px;"+"background:radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 34%, rgba(217,217,217,0.0) 70%)"+";animation-duration: "+Math.floor(10*Math.random()+5)+"s;animation-delay:"+Math.floor(15*Math.random())+"s;";return this.stylesArray.push(e),e}return this.stylesArray[t]},renderParticle(t,e){var a=e.createRadialGradient(t.x,t.y,1,t.x,t.y,t.radius-t.radius/10);a.addColorStop(0,t.color),a.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=a,e.beginPath(),e.arc(t.x,t.y,t.radius,0,2*Math.PI),e.closePath(),e.fill()},renderShootingParticles(t,e){t.x<470&&(e.fillStyle="rgba(255,255,255,"+t.opacity+")",e.beginPath(),e.arc(t.x,t.y,t.radius,0,2*Math.PI),e.closePath(),e.fill())},moveShootingParticle(t){!0===this.displayMode&&Date.now()>this.displayModeEngage+1e3?(t.opacity=t.x/470,t.x/470*10>0?t.radius=t.x/470*10:t.radius=0,t.x>0?Date.now()>this.displayModeEngage+1e3+t.delay&&(t.x=t.x-t.speed):t.x=470):!1===this.displayMode&&Date.now()<this.displayModeEngage+1500?(t.opacity=t.x/470,t.x/470*10>0?t.radius=t.x/470*10:t.radius=0,t.x=t.x-t.speed):!1===this.displayMode&&Date.now()>this.displayModeEngage+1500&&(t.x=470)},createRings(t,e){for(let a=0;a<t;a++){let t=Math.floor(360*Math.random()),r=t+50*Math.random()+50,i={startAng:t*(Math.PI/180),endAng:r*(Math.PI/180),length:120+7*a,shown:!0,moveDirection:Math.random()>.5,moveDone:!1};e.push(i),console.log(i)}},updateRings(t){!1===t.moveDone?(t.moveDirection?(t.startAng-=.01,t.endAng-=.01):(t.startAng+=.01,t.endAng+=.01),Math.random()<.02&&(t.moveDone=!0)):(t.moveDirection=!t.moveDirection,t.moveDone=!1)},drawOuterRing(t,e){t.forEach(t=>{!0===t.shown&&(e.beginPath(),e.arc(225,225,t.length,t.startAng,t.endAng,0,2*Math.PI),e.fillStyle="transparent",e.fill(),e.shadowColor="rgba(255,255,255,1)",e.shadowBlur=15,e.lineWidth=5,e.strokeStyle="rgba(255,255,255,1)",e.stroke(),e.closePath())})},adjustLength(t){t.grow&&!this.displayMode?(t.usedLength+=Math.abs(t.speed)/2,t.usedLength>t.length+20&&(t.grow=!1),t.radius>t.startRadius&&(t.radius-=.5,t.usedLength+=t.radius/3)):t.grow||this.displayMode?this.displayMode&&(!t.grow&&(t.grow=!0),t.usedLength>0&&(t.usedLength-=t.radius/10),t.radius<25&&(t.radius+=1)):(t.usedLength-=Math.abs(t.speed)/2,t.usedLength<t.length-20&&(t.grow=!0),t.radius>t.startRadius&&(t.radius-=1))},moveParticle(t){t.usedAngle=t.usedAngle+t.speed,t.x=250+t.usedLength*Math.cos(t.usedAngle*(Math.PI/180)),t.y=250+t.usedLength*Math.sin(t.usedAngle*(Math.PI/180))},drawCircularPlate(t,e){t.forEach(t=>{e.beginPath(),e.arc(225,225,150,t[0]*(Math.PI/180),t[1]*(Math.PI/180)),e.fillStyle="transparent",e.fill(),e.shadowColor=t[3],e.shadowBlur=15,e.lineWidth=t[2],e.strokeStyle=t[3],e.stroke(),e.closePath()}),e.beginPath(),e.arc(225,225,138,0,2*Math.PI),e.fillStyle="transparent",e.fill(),e.shadowColor="rgba(255,255,255,1)",e.shadowBlur=15,e.lineWidth=2,e.strokeStyle="rgba(255,255,255,1)",e.stroke(),e.closePath(),e.beginPath(),e.arc(225,225,163,0,2*Math.PI),e.fillStyle="transparent",e.fill(),e.shadowColor="rgba(255,255,255,1)",e.shadowBlur=15,e.lineWidth=2,e.strokeStyle="rgba(255,255,255,1)",e.stroke(),e.closePath()}},mounted(){this.drawCounterInitiation(this.count),this.createCoreParticles(this.particles),this.createShootingParticles(this.shootingParticles),this.createRings(this.ringNumber,this.ringArray);let t=document.getElementById("coreCanvas");t.width=document.getElementById("core").offsetWidth,t.height=document.getElementById("core").offsetHeight;let e=document.getElementById("firstCanvas");e.width=document.getElementById("firstCircle").offsetWidth,e.height=document.getElementById("firstCircle").offsetHeight;let a=e.getContext("2d");this.drawCircularPlate(this.angles,a);document.getElementById("secondCanvas");e.width=document.getElementById("firstCircle").offsetWidth,e.height=document.getElementById("firstCircle").offsetHeight,window.addEventListener("resize",(function(){let t=document.getElementById("coreCanvas");t.width=document.getElementById("core").offsetWidth,t.height=document.getElementById("core").offsetHeight;let e=document.getElementById("firstCanvas");e.width=document.getElementById("firstCircle").offsetWidth,e.height=document.getElementById("firstCircle").offsetHeight;document.getElementById("secondCanvas");e.width=document.getElementById("firstCircle").offsetWidth,e.height=document.getElementById("firstCircle").offsetHeight}),!0),this.loop()}},i=(a(557),a(1)),s=Object(i.a)(r,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[t._l(t.clouds,(function(e,r){return a("div",{staticClass:"cloud",style:t.makeStarStyles(r),attrs:{id:"cloud-"+r}})})),t._v(" "),a("div",{class:t.displayMode?"active":"notActive",attrs:{id:"holoLoader"}},[t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),a("div",{staticClass:"holoLayer",attrs:{id:"thirdCircle"}}),t._v(" "),a("div",{staticClass:"holoLayer",attrs:{id:"fourthCircle"}}),t._v(" "),t._m(3),t._v(" "),a("div",{staticClass:"holoLayer",attrs:{id:"sixthCircle"}})]),t._v(" "),a("canvas",{class:t.displayMode?"active":"notActive",attrs:{width:"470",height:"200",id:"shootingParticles"}})],2)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"holoLayer",attrs:{id:"core"}},[e("canvas",{attrs:{id:"coreCanvas"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"holoLayer",attrs:{id:"firstCircle"}},[e("canvas",{attrs:{width:"450",height:"450",id:"secondCanvas"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"holoLayer",attrs:{id:"secondCircle"}},[e("div",{staticClass:"slider a"},[e("div",{staticClass:"sliderPoint a"})])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"holoLayer",attrs:{id:"fifthCircle"}},[e("canvas",{attrs:{id:"firstCanvas"}})])}],!1,null,"4a2d0656",null);e.default=s.exports}}]);