
	function printInstalled(tpls,out) {
		
		console.log(OTPLS,RSRC);
		var list = OTPLS.list;
		
		out.push("<h1>Installed</h1>");
		out.push("<table style=\"font-size:1.2em; line-height:1.7em;\">");
		out.push("<tr><th style=\"width:300px\">Name</th><th></th></tr>");
		
		for(var ri=0; ri<RSRC.length; ri++) {
			var id=RSRC[ri], cr=null;
			for(var i=0; i<list.length; i++) if(list[i][3]==id) cr=list[i];
			out.push("<tr><td>")
			if(cr) {
				if(cr[0]==TYPE) out.push("<a class=\"clc\" "+OC("t-"+tempID(cr))+">"+shorten(cr[9],24)+"</a>");
				else out.push(shorten(cr[9],24));
			}
			else   out.push("????");
			//out.push("</td><td>Uninstall</td></tr>");
			out.push("<td><a class=\"clickable\" onclick=\"itemClicked('"+id+"')\" style=\"cursor:pointer\" >Uninstall</a></td></tr>");
		}
		
		out.push("</table>");
	}
	
	function printAuthors(tps, out) {
		var as = JSON.parse(JSON.stringify(tps.authors)), list=tps.list;
		
		var to = [0,"Total:",0,0,0,0];
		for(var i=0; i<list.length; i++) {
			var tpl=list[i], ca=as[tpl[1]];
			if(ca.length==2) ca.push(0,0,0,0);  // tcount, usages, size, time
			ca[2]++;  ca[3]+=tpl[7];  ca[4]+=tpl[8];  ca[5]=Math.max(ca[5],tpl[2]);
			to[2]++;  to[3]+=tpl[7];  to[4]+=tpl[8];  to[5]=Math.max(to[5],tpl[2]);
		}
		var nas = [];  for(var i=0; i<as.length; i++) if(as[i].length!=2) nas.push(as[i]);  as=nas;
		
		as.sort(function(a,b) { return b[3]-a[3];  });  as.push(to);
		
		var tdr = "<td style=\"text-align:right; width:120px;\">";
		var thr = "<th style=\"text-align:right; width:120px;\">";
		
		out.push("<h1>Best Contributors</h1>");
		out.push("<table style=\"font-size:1.2em; line-height:1.7em;\">");
		out.push("<tr><th></th><th>Name</th>"+thr+"#Templates</th>"+thr+"Usages</th>"+thr+"Total Size</th>"+thr+"Last One</th></tr>");
		
		
		for(var i=0; i<as.length; i++) {
			var ca = as[i], last=i+1==as.length;
			out.push(last ? "<tr style=\"font-weight:bold\">" : "<tr>");
			
			if(!last) out.push("<td style=\"text-align:right;\">"+(i+1)+".</td>");
			else out.push("<td></td>");
			out.push("<td style=\"padding-left:10px;\"><a class=\"clc\" "+OC("a-"+ca[0])+">"+shorten(ca[1],24)+"</a></td>");
			out.push(tdr+ca[2]+"</td>");
			out.push(tdr+printNum(ca[3])+"</td>");
			out.push(tdr+printBytes(ca[4])+"</td>");
			out.push(tdr+"<small>"+printAge(ca[5])+" ago</small></td>");
			out.push("</tr>");
		}
		out.push("</table>");
	}
	
	function makeView(tps,out,twds,wds,curc,caut,cit) {
		var list = tps.list, cts=tps.categories;				
		if(cit==-1) {
			if(caut!=-1) out.push("<h1 style=\"font-size:2.4em\"><a "+OC("-a")+" class=\"clc\">×</a> <b>"+escapeHtml(tps.authors[caut][1])+"</b></h1>");
			var oi = out.length; out.push("");
			var N=0, U=0, S=0;
			for(var i=0; i<list.length; i++) {
				var tpl = list[i], cat=tpl[5], pcat=cat-(cat%10);
				if(caut!=-1 && tpl[1]!=caut) continue;
				if(curc!=-1) {
					if((curc%10)==0) {  if(pcat!=curc) continue;  }
					else if(curc!=cat) continue;
				}
				if(twds!="") {
					var occ=0, tot=(tpl[8] + " " + tpl[9] + " " + tps.authors[tpl[1]] + " " + cts["c"+tpl[5]]).toLowerCase();
					for(var j=0; j<wds.length; j++) {
						if(tot.indexOf(wds[j])!=-1) occ++;
					}
					if(occ==0) continue;
				}
				makeItem(tps,i, cts,out, false);
				N++;  U+=tpl[7];  S+=tpl[8];
			}
			if(caut!=-1) out[oi]="<p>"+N+" Templates • "+printNum(U)+" "+uses()+" • "+printBytes(S)+"</p>";
		}
		else {
			var tpl = list[cit];
			makeItem(tps,cit,cts,out, true);
			out.push("<iframe src=\"comments.html#"+tempID(tpl)+"\" frameborder=\"0\" style=\"border:none;  max-width:800px; width:calc(100% - 20px); height:800px; background-color:white;\"></iframe>");
		}
	}
	
	function uses() {  return TYPE==0?"uses":"installs";  }
	function shorten(str, lim) {
		return (str.length<lim) ?str:str.slice(0,lim-3)+"...";
	}
	function mmd(e) {
		var t=e.target;  //if(t.tagName.toLowercase()!="img") return;
		var r = t.getBoundingClientRect();
		t.setAttribute("style", "object-position: "+(100*e.offsetX/r.width)+"% "+(100*e.offsetY/r.height)+"%;");
	}
	function mmo(e) {
		var t=e.target;
		t.setAttribute("style", "object-position: 50% 50%;");
	}
	function toID(str) {  return str.toLowerCase().replace(/\s+/g, "-")+".html"; }
	function makeItem(tps, ind,cts,lst, big) {
		var tpl = tps.list[ind], gotR = RSRC.indexOf(tpl[3])!=-1;
		var rst = window.innerWidth-(245+30)-2;  //console.log(iw);
		var num = 1;  while(rst/num>300) num++;
		var cc = Math.floor(rst/num);  //console.log(cc);
		var isz = cc-16;  //console.log(isz);
		
		var tit = escapeHtml(tpl[9]);
		var lim = ~~(isz/9);  //console.log(tpl);
		
		if(big) isz=rst/2;
		var wi = (isz+"px");
		var hi = ((isz*9.3/16)+"px");
		
		lst.push("<div class=\"item "+(big?"flexrow":"tiny")+"\" "+(big?"":"style=\"width:"+wi+";\" ")+">");
		
		var iurl = tpl[4]; //(Math.random()<0.5?"wide.png":"tall.png");  // tpl[3]
		//*
		
		
		lst.push("<div style=\"width:"+wi+"; min-width:"+wi+"; height:"+hi+"\">");  // ict
		if(!big) lst.push("<a "+OC("t-"+tempID(tpl))+" title=\""+tit+"\">");
		lst.push("<img src=\""+iurl+"\" loading=\"lazy\" onmousemove=\"mmd(event)\" onmouseout=\"mmo(event)\" "
		+(big ? "onclick=\"itemClicked()\" title=\"Open &quot;"+tit+"&quot;\"" : "")+" />");
		//if(big) lst.push("<div class=\"openimg\" style=\"width:"+wi+"; height:"+hi+";\" "+(big ? "onclick=\"itemClicked("+ind+")\" title=\"Open &quot;"+tit+"&quot;\"" : "")+"><br/><br/>Open</div>");
		if(!big) lst.push("</a>");
		lst.push("</div>"); // ict
		lst.push("<div class=\""+"post"+(big?"_big":"")+"\">"); // cmt
		
		if(!big) lst.push("<a class=\"clc\" "+OC("t-"+tempID(tpl))+" title=\""+tit+"\">");
		var tag = big?"h1":"span";
		lst.push("<"+tag+" class=\"title "+(big?"t1":"t2")+"\" "+(big?"onclick=\"labelClicked()\"":"")+">" + 
			(big?tit:shorten(tit,lim)) + (gotR?" ✅":"") + "</"+tag+">");
		if(!big) lst.push("</a>");
		
		var au = tps.authors[tpl[1]];
		var cat = cts["c"+tpl[5]];
		lst.push("<span>")
		lst.push( "By <a class=\"clc\" "+OC("a-"+au[0]     )+">" +escapeHtml(big?au[1]:shorten(au[1],~~(lim*0.7)))+"</a>");
		lst.push(" in <a class=\"clc\" "+OC("c-"+toCat(cat))+">" + cat+"</a>");
		lst.push("</span>");
		
		if(big) {
			lst.push("<p>"+findLinks(escapeHtml(tpl[10]))+"</p>");
			lst.push("<p style=\"font-size:1.5em; margin-bottom: 0em;\">");
			var dstr = printDate(tpl[2]);
			
			lst.push("<span title=\""+printNum(tpl[6])+" views"+"\">"+printNum(tpl[7])+" "+uses()+"</span>")
			lst.push(" • "+printBytes(tpl[8]));
			lst.push(" • <span title=\""+((0.001*Date.now()-tpl[2])/(60*60*24)).toFixed(2)+" days ago\">"+dstr+"</span>");//  lst.push("<br/>");
			
			lst.push("</p>");
			lst.push("<p style=\"font-size:1.2em; margin-top:0.5em;\">");
			var aurl = "//www.Photopea.com#t"+tempID(tpl);
			if(TYPE==0) lst.push("<a href=\""+aurl+"\" target=\"_blank\" class=\"clickable\" >photopea.com#t"+tempID(tpl)+"</a>");
			else        lst.push("<a class=\"clickable\" onclick=\"itemClicked()\" style=\"cursor:pointer\" >"+(gotR?"Uninstall":"Install")+"</a>");
			lst.push("</p>");
		}
		else {
			lst.push("<br/><span>");
			
			var us=tpl[7], ss="";  //us = Math.floor(Math.random()*1e9);
			if(us<1000) ss=us+"";
			else if(us<1e6) ss=(us/1e3).toFixed(us<1e4 ? 1 : 0)+"K";
			else if(us<1e9) ss=(us/1e6).toFixed(us<1e7 ? 1 : 0)+"M";
			
			var sl=ss.length-3;
			if(ss[sl]=="." && ss[sl+1]=="0") ss=ss.slice(0,sl)+ss[sl+2];
			
			lst.push(ss+" "+uses());
			
			
			var ts = printAge(tpl[2]);
			
			lst.push(" • "+ts+" ago");
			lst.push("</span>");
		}
		lst.push("</div>"); // cmt
		lst.push("</div>");
	}
	
	function OC(tgt) {  // onclick
		if(IFR) return "onclick=\"rebuild('"+tgt+"')\" style=\"cursor:pointer;\"";
		if(tgt[0]=="-") tgt="";
		return "href=\""+(tgt==""?"/templates/":tgt)+"\"";
	}
	
	function printAge(time) {
		var sts = [60, 60, 24, 30, 12,10000];
		var uns = ["sec","min","hour","day","month","year"];
		var td = (Date.now()/1000) - time, ts="";
		var lim = 1;
		for(var i=0; i<sts.length; i++) {
			var ol=lim;  lim*=sts[i];
			if(td<lim) {  var n=Math.round(td/ol);  ts=n+" "+uns[i]+(n>1?"s":"");  break; }
		}
		return ts;
	}
	function printBytes(bs) {
		var bst = bs.toString(2);
		var zrs=0; while(zrs+10<bst.length) zrs+=10;
		var num = (bs/Math.pow(2,zrs)), rn=Math.round(num), fxd=num.toFixed(1);
		num = (rn>99 || fxd[fxd.length-1]=="0") ? rn : fxd;
		
		var ext = ["B","KB","MB","GB","TB","PB"][Math.floor(zrs/10)];
		return num+" "+ext;
	}
	
	function printDate(d) {
		var dt = new Date(d*1000);
		var mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"][dt.getMonth()];
		return mon+" "+(dt.getDate())+", "+dt.getFullYear();
	}
	function printNum(f) {  return f.toLocaleString('en-US', {maximumFractionDigits:2});  }
	function tempID(tpl) {  return tpl[3].split("").reverse().join("");  }
	function isWhite(c) {  return c==" " || c=="\n" || c=="\t";  }
	function isChar(c) {  c=c.charCodeAt(0);  return (65<=c && c<=90) || (97<=c && c<=122);  }
	
	function findLinks(str) {
		//return str;
		var iod = [];
		for(var i=0; i<str.length-2; i++) if(str[i]=="." && isChar(str[i+1]) && isChar(str[i+2])) iod.push(i);
		iod.reverse();  //console.log(iod);
		
		var omit=["https://", "http://", "//", "www."];
		
		var min = 1e9;
		for(var i=0; i<iod.length; i++) {
			var i0=iod[i], i1=i0;  if(i0>min) continue;
			
			while(i0>0 && !isWhite(str[i0-1])) i0--;
			while(i1<str.length-1 && !isWhite(str[i1+1])) i1++;
			if(str[i0]==" ") i0++;  if(str[i1]==" ") i1--;
			var mid = str.slice(i0,i1+1), url=mid;
			for(var j=0; j<omit.length; j++) if(mid.startsWith(omit[j])) mid=mid.slice(omit[j].length);
			if(url.indexOf("//")==-1) url="//"+url;
			str = str.slice(0,i0)+"<a href=\""+url+"\" target=\"_blank\">"+mid+"</a>"+str.slice(i1+1);
			min=i0;
		}
		return str//.replaceAll("\n","<br/>");
	}
	
	function escapeHtml(unsafe) {
		return unsafe
			 .replace(/&/g, "&amp;")
			 .replace(/</g, "&lt;")
			 .replace(/>/g, "&gt;")
			 .replace(/"/g, "&quot;")
			 .replace(/'/g, "&#039;");
	 }
	
	function getCatCounts(tps) {
		var list = tps.list, cts=tps.categories;
		var ccnt = JSON.parse(JSON.stringify(cts));
		for(var cat in ccnt) ccnt[cat]=0;
		for(var i=0; i<list.length; i++) {
			var tpl = list[i], cat=tpl[5], pcat=cat-(cat%10);
			ccnt["c"+cat]++;  if(cat!=pcat) ccnt["c"+pcat]++;
		}
		return ccnt;
	}
	
	function getCats(tps, curr,out) {
		var cts=tps.categories, ccnt = getCatCounts(tps);	
		out.push("<br/>");
		out.push("<span class=\"cat top clickable\"><a "+OC("authors")+">AUTHORS</a></span>");			
		out.push("<span class=\"cat_title\">CATEGORIES</span>");
		for(var cat in cts) {
			if(ccnt[cat]==0) continue;
			var cw = parseInt(cat.slice(1)), isTop = (cw%10)==0;  //console.log(cw);
			out.push("<a "+OC(cw==curr ? "-c" : "c-"+toCat(cts[cat]))+">");
			out.push("<div class=\"cat"+(isTop?" top":"") + (cw==curr?" blue":"")+" clickable\" >");  // onclick=\"catClicked("+cw+")\"
			out.push(cts[cat]);
			out.push("<span class=\"count\">"+ccnt[cat]+"</span>");
			out.push("</div>");
			out.push("</a>");
		}
		if(TYPE!=0) out.push("<br/><span class=\"cat top clickable\"><a "+OC("installed")+">INSTALLED ("+RSRC.length+")</a></span>");			
	}
	function toCat(cat) {  
		var ioa=cat.indexOf(" &");
		if(ioa!=-1) cat=cat.slice(0,ioa)+cat.slice(ioa+2);
		var ioa=cat.indexOf(" /");
		if(ioa!=-1) cat=cat.slice(0,ioa)+cat.slice(ioa+2);
		return cat.toLowerCase().replace(/\s+/g, "-");  
	}
	
	
	function cost0(v) {
		var age = (Date.now()*0.001 - v[2]) / (60*60*24);  // age in days
		var cst = (v[7]+1) / age;  // usages per day
		var ext = 20*Math.pow(Math.PI,-age*0.15);
		
		return cst+ext;
	}
	function cost1(v) { return  v[2]; }
	function cost2(v) { return  v[7]; }
	
	