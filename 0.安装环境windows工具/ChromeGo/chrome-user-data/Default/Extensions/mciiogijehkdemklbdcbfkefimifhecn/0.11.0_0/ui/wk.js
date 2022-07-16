/*
 zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
'use strict';(function(){function t(f){throw f;}function v(f,c){f=f.split(".");var d=Q;f[0]in d||!d.execScript||d.execScript("var "+f[0]);for(var h;f.length&&(h=f.shift());)f.length||void 0===c?d=d[h]?d[h]:d[h]={}:d[h]=c}function w(f,c,d){var h;"number"===typeof c||(c=0);var a="number"===typeof d?d:f.length;d=-1;for(h=a&7;h--;++c)d=d>>>8^m[(d^f[c])&255];for(h=a>>3;h--;c+=8)d=d>>>8^m[(d^f[c])&255],d=d>>>8^m[(d^f[c+1])&255],d=d>>>8^m[(d^f[c+2])&255],d=d>>>8^m[(d^f[c+3])&255],d=d>>>8^m[(d^f[c+4])&255],
d=d>>>8^m[(d^f[c+5])&255],d=d>>>8^m[(d^f[c+6])&255],d=d>>>8^m[(d^f[c+7])&255];return(d^4294967295)>>>0}function q(){}function D(f){var c=f.length,d=0,h=Number.POSITIVE_INFINITY,a,g,l;for(g=0;g<c;++g)f[g]>d&&(d=f[g]),f[g]<h&&(h=f[g]);var p=1<<d;var K=new (r?Uint32Array:Array)(p);var F=1;var M=0;for(a=2;F<=d;){for(g=0;g<c;++g)if(f[g]===F){var J=0;var G=M;for(l=0;l<F;++l)J=J<<1|G&1,G>>=1;G=F<<16|g;for(l=J;l<p;l+=a)K[l]=G;++M}++F;M<<=1;a<<=1}return[K,d,h]}function y(f,c){this.I=[];this.J=32768;this.d=
this.j=this.c=this.n=0;this.input=r?new Uint8Array(f):f;this.U=!1;this.k=E;this.z=!1;if(c||!(c={}))c.index&&(this.c=c.index),c.bufferSize&&(this.J=c.bufferSize),c.la&&(this.k=c.la),c.resize&&(this.z=c.resize);switch(this.k){case n:this.a=32768;this.b=new (r?Uint8Array:Array)(32768+this.J+258);break;case E:this.a=0;this.b=new (r?Uint8Array:Array)(this.J);this.e=this.ea;this.q=this.ba;this.K=this.da;break;default:t(Error("invalid inflate mode"))}}function u(f,c){for(var d=f.j,h=f.d,a=f.input,g=f.c,
l=a.length;h<c;)g>=l&&t(Error("input buffer is broken")),d|=a[g++]<<h,h+=8;f.j=d>>>c;f.d=h-c;f.c=g;return d&(1<<c)-1}function H(f,c){var d=f.j,h=f.d,a=f.input,g=f.c,l=a.length,p=c[0];for(c=c[1];h<c&&!(g>=l);)d|=a[g++]<<h,h+=8;a=p[d&(1<<c)-1];l=a>>>16;f.j=d>>l;f.d=h-l;f.c=g;return a&65535}function B(f){function c(p,K,F){var M,J=this.w,G,O;for(O=0;O<p;)switch(M=H(this,K),M){case 16:for(G=3+u(this,2);G--;)F[O++]=J;break;case 17:for(G=3+u(this,3);G--;)F[O++]=0;J=0;break;case 18:for(G=11+u(this,7);G--;)F[O++]=
0;J=0;break;default:J=F[O++]=M}this.w=J;return F}var d=u(f,5)+257,h=u(f,5)+1,a=u(f,4)+4,g=new (r?Uint8Array:Array)(A.length),l;for(l=0;l<a;++l)g[A[l]]=u(f,3);if(!r)for(l=a,a=g.length;l<a;++l)g[A[l]]=0;a=D(g);g=new (r?Uint8Array:Array)(d);l=new (r?Uint8Array:Array)(h);f.w=0;f.K(D(c.call(f,d,a,g)),D(c.call(f,h,a,l)))}function L(f){this.input=f;this.c=0;this.L=[];this.W=!1}var Q=this,r="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==
typeof DataView;new (r?Uint8Array:Array)(256);var b;for(b=0;256>b;++b){var e=b,k=7;for(e>>>=1;e;e>>>=1)--k}b=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,
3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,
453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,
3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,
1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,
1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918E3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];var m=r?new Uint32Array(b):b;q.prototype.na=function(){return this.name};q.prototype.getData=function(){return this.data};q.prototype.ga=function(){return this.ha};v("Zlib.GunzipMember",
q);v("Zlib.GunzipMember.prototype.getName",q.prototype.na);v("Zlib.GunzipMember.prototype.getData",q.prototype.getData);v("Zlib.GunzipMember.prototype.getMtime",q.prototype.ga);b=[];for(e=0;288>e;e++)switch(!0){case 143>=e:b.push([e+48,8]);break;case 255>=e:b.push([e-144+400,9]);break;case 279>=e:b.push([e-256,7]);break;case 287>=e:b.push([e-280+192,8]);break;default:t("invalid literal: "+e)}b=function(){function f(a){switch(!0){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,
a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,
a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:t("invalid length: "+a)}}var c=[],d;for(d=3;258>=d;d++){var h=f(d);c[d]=h[2]<<24|h[1]<<16|h[0]}return c}();r&&new Uint32Array(b);var n=0,E=1;y.prototype.B=function(){for(;!this.U;){var f=u(this,3);f&1&&
(this.U=!0);f>>>=1;switch(f){case 0:f=this.input;var c=this.c,d=this.b,h=this.a,a=f.length,g=d.length;this.d=this.j=0;c+1>=a&&t(Error("invalid uncompressed block header: LEN"));var l=f[c++]|f[c++]<<8;c+1>=a&&t(Error("invalid uncompressed block header: NLEN"));a=f[c++]|f[c++]<<8;l===~a&&t(Error("invalid uncompressed block header: length verify"));c+l>f.length&&t(Error("input buffer is broken"));switch(this.k){case n:for(;h+l>d.length;){a=g-h;l-=a;if(r)d.set(f.subarray(c,c+a),h),h+=a,c+=a;else for(;a--;)d[h++]=
f[c++];this.a=h;d=this.e();h=this.a}break;case E:for(;h+l>d.length;)d=this.e({t:2});break;default:t(Error("invalid inflate mode"))}if(r)d.set(f.subarray(c,c+l),h),h+=l,c+=l;else for(;l--;)d[h++]=f[c++];this.c=c;this.a=h;this.b=d;break;case 1:this.K(I,P);break;case 2:B(this);break;default:t(Error("unknown BTYPE: "+f))}}return this.q()};b=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];var A=r?new Uint16Array(b):b;b=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,
258,258,258];var z=r?new Uint16Array(b):b;b=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0];var C=r?new Uint8Array(b):b;b=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];var x=r?new Uint16Array(b):b;b=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];var N=r?new Uint8Array(b):b;b=new (r?Uint8Array:Array)(288);e=0;for(k=b.length;e<k;++e)b[e]=143>=e?8:255>=e?9:279>=e?7:8;var I=D(b);b=new (r?Uint8Array:
Array)(30);e=0;for(k=b.length;e<k;++e)b[e]=5;var P=D(b);y.prototype.K=function(f,c){var d=this.b,h=this.a;this.r=f;for(var a=d.length-258,g,l,p;256!==(g=H(this,f));)if(256>g)h>=a&&(this.a=h,d=this.e(),h=this.a),d[h++]=g;else for(g-=257,p=z[g],0<C[g]&&(p+=u(this,C[g])),g=H(this,c),l=x[g],0<N[g]&&(l+=u(this,N[g])),h>=a&&(this.a=h,d=this.e(),h=this.a);p--;)d[h]=d[h++-l];for(;8<=this.d;)this.d-=8,this.c--;this.a=h};y.prototype.da=function(f,c){var d=this.b,h=this.a;this.r=f;for(var a=d.length,g,l,p;256!==
(g=H(this,f));)if(256>g)h>=a&&(d=this.e(),a=d.length),d[h++]=g;else for(g-=257,p=z[g],0<C[g]&&(p+=u(this,C[g])),g=H(this,c),l=x[g],0<N[g]&&(l+=u(this,N[g])),h+p>a&&(d=this.e(),a=d.length);p--;)d[h]=d[h++-l];for(;8<=this.d;)this.d-=8,this.c--;this.a=h};y.prototype.e=function(){var f=new (r?Uint8Array:Array)(this.a-32768),c=this.a-32768,d,h=this.b;if(r)f.set(h.subarray(32768,f.length));else{var a=0;for(d=f.length;a<d;++a)f[a]=h[a+32768]}this.I.push(f);this.n+=f.length;if(r)h.set(h.subarray(c,c+32768));
else for(a=0;32768>a;++a)h[a]=h[c+a];this.a=32768;return h};y.prototype.ea=function(f){var c,d=this.input.length/this.c+1|0,h,a,g,l=this.input,p=this.b;f&&("number"===typeof f.t&&(d=f.t),"number"===typeof f.aa&&(d+=f.aa));2>d?(h=(l.length-this.c)/this.r[2],g=h/2*258|0,a=g<p.length?p.length+g:p.length<<1):a=p.length*d;r?(c=new Uint8Array(a),c.set(p)):c=p;return this.b=c};y.prototype.q=function(){var f=0,c=this.b,d=this.I,h=new (r?Uint8Array:Array)(this.n+(this.a-32768)),a,g;if(0===d.length)return r?
this.b.subarray(32768,this.a):this.b.slice(32768,this.a);var l=0;for(a=d.length;l<a;++l){var p=d[l];var K=0;for(g=p.length;K<g;++K)h[f++]=p[K]}l=32768;for(a=this.a;l<a;++l)h[f++]=c[l];this.I=[];return this.buffer=h};y.prototype.ba=function(){var f,c=this.a;r?this.z?(f=new Uint8Array(c),f.set(this.b.subarray(0,c))):f=this.b.subarray(0,c):(this.b.length>c&&(this.b.length=c),f=this.b);return this.buffer=f};L.prototype.fa=function(){this.W||this.B();return this.L.slice()};L.prototype.B=function(){for(var f=
this.input.length;this.c<f;){var c=new q;var d=void 0;var h,a=this.input;var g=this.c;c.X=a[g++];c.Y=a[g++];31===c.X&&139===c.Y||t(Error("invalid file signature:"+c.X+","+c.Y));c.p=a[g++];switch(c.p){case 8:break;default:t(Error("unknown compression method: "+c.p))}c.C=a[g++];var l=a[g++]|a[g++]<<8|a[g++]<<16|a[g++]<<24;c.ha=new Date(1E3*l);c.ya=a[g++];c.xa=a[g++];0<(c.C&4)&&(c.ia=a[g++]|a[g++]<<8,g+=c.ia);if(0<(c.C&8)){var p=[];for(h=0;0<(l=a[g++]);)p[h++]=String.fromCharCode(l);c.name=p.join("")}if(0<
(c.C&16)){p=[];for(h=0;0<(l=a[g++]);)p[h++]=String.fromCharCode(l);c.ua=p.join("")}0<(c.C&2)&&(c.ca=w(a,0,g)&65535,c.ca!==(a[g++]|a[g++]<<8)&&t(Error("invalid header crc16")));l=a[a.length-4]|a[a.length-3]<<8|a[a.length-2]<<16|a[a.length-1]<<24;a.length-g-4-4<512*l&&(d=l);g=new y(a,{index:g,bufferSize:d});c.data=d=g.B();g=g.c;c.va=l=(a[g++]|a[g++]<<8|a[g++]<<16|a[g++]<<24)>>>0;w(d,void 0,void 0)!==l&&t(Error("invalid CRC-32 checksum: 0x"+w(d,void 0,void 0).toString(16)+" / 0x"+l.toString(16)));c.wa=
l=(a[g++]|a[g++]<<8|a[g++]<<16|a[g++]<<24)>>>0;(d.length&4294967295)!==l&&t(Error("invalid input size: "+(d.length&4294967295)+" / "+l));this.L.push(c);this.c=g}this.W=!0;f=this.L;c=d=g=0;for(a=f.length;c<a;++c)d+=f[c].data.length;if(r)for(d=new Uint8Array(d),c=0;c<a;++c)d.set(f[c].data,g),g+=f[c].data.length;else{d=[];for(c=0;c<a;++c)d[c]=f[c].data;d=Array.prototype.concat.apply([],d)}return d};v("Zlib.Gunzip",L);v("Zlib.Gunzip.prototype.decompress",L.prototype.B);v("Zlib.Gunzip.prototype.getMembers",
L.prototype.fa)}).call(this);var R=function(){function t(b){var e=new u,k=!0;if(b){if("number"===typeof b)e.buffer=new B(b);else{if("writeByte"in b)return b;e.buffer=b}k=!1}else e.buffer=new B(16384);e.f=0;e.D=function(m){if(k&&this.f>=this.buffer.length){var n=new B(2*this.buffer.length);this.buffer.R(n);this.buffer=n}this.buffer[this.f++]=m};e.S=function(){if(this.f!==this.buffer.length){if(!k)throw new TypeError("outputsize does not match decoded input");var m=new B(this.f);this.buffer.R(m,0,0,this.f);this.buffer=m}return this.buffer};
e.za=!0;return e}function v(b){if("readByte"in b)return b;var e=new u;e.f=0;e.o=function(){return b[this.f++]};e.seek=function(k){this.f=k};e.i=function(){return this.f>=b.length};return e}function w(b,e){this.$=this.Z=this.v=0;this.P(b,e)}function q(b,e){var k=r[b]||"unknown error";e&&(k+=": "+e);e=new TypeError(k);e.errorCode=b;throw e;}function D(b,e){for(var k=b[e];0<e;e--)b[e]=b[e-1];return b[0]=k}function y(){var b=4294967295;this.T=function(){return~b>>>0};this.sa=function(e,k){for(;0<k--;)b=
b<<8^Q[(b>>>24^e)&255]}}function u(){}function H(b){this.stream=b;this.H=this.g=0;this.l=!1}var B=Uint8Array;B.prototype.R=function(b,e,k,m){b.set(this.subarray(k,m),e)};var L=[0,1,3,7,15,31,63,127,255];H.prototype.ja=function(){this.l||(this.H=this.stream.o(),this.l=!0)};H.prototype.read=function(b){for(var e=0;0<b;){this.ja();var k=8-this.g;b>=k?(e<<=k,e|=L[k]&this.H,this.l=!1,this.g=0,b-=k):(e<<=b,k-=b,e|=(this.H&L[b]<<k)>>k,this.g+=b,b=0)}return e};H.prototype.seek=function(b){var e=b%8;this.g=
e;this.stream.seek((b-e)/8);this.l=!1};H.prototype.ra=function(){var b=new B(6),e;for(e=0;e<b.length;e++)b[e]=this.read(8);return b.reduce(function(k,m){return k+m.toString(16)},"")};u.prototype.o=function(){throw Error("abstract method readByte() not implemented");};u.prototype.read=function(b,e,k){for(var m=0;m<k;){var n=this.o();if(0>n)return 0===m?-1:m;b[e++]=n;m++}return m};u.prototype.seek=function(){throw Error("abstract method seek() not implemented");};u.prototype.D=function(){throw Error("abstract method readByte() not implemented");
};u.prototype.write=function(b,e,k){var m;for(m=0;m<k;m++)this.D(b[e++]);return k};u.prototype.flush=function(){};var Q=new Uint32Array([0,79764919,159529838,222504665,319059676,398814059,445009330,507990021,638119352,583659535,797628118,726387553,890018660,835552979,1015980042,944750013,1276238704,1221641927,1167319070,1095957929,1595256236,1540665371,1452775106,1381403509,1780037320,1859660671,1671105958,1733955601,2031960084,2111593891,1889500026,1952343757,2552477408,2632100695,2443283854,2506133561,
2334638140,2414271883,2191915858,2254759653,3190512472,3135915759,3081330742,3009969537,2905550212,2850959411,2762807018,2691435357,3560074640,3505614887,3719321342,3648080713,3342211916,3287746299,3467911202,3396681109,4063920168,4143685023,4223187782,4286162673,3779000052,3858754371,3904687514,3967668269,881225847,809987520,1023691545,969234094,662832811,591600412,771767749,717299826,311336399,374308984,453813921,533576470,25881363,88864420,134795389,214552010,2023205639,2086057648,1897238633,1976864222,
1804852699,1867694188,1645340341,1724971778,1587496639,1516133128,1461550545,1406951526,1302016099,1230646740,1142491917,1087903418,2896545431,2825181984,2770861561,2716262478,3215044683,3143675388,3055782693,3001194130,2326604591,2389456536,2200899649,2280525302,2578013683,2640855108,2418763421,2498394922,3769900519,3832873040,3912640137,3992402750,4088425275,4151408268,4197601365,4277358050,3334271071,3263032808,3476998961,3422541446,3585640067,3514407732,3694837229,3640369242,1762451694,1842216281,
1619975040,1682949687,2047383090,2127137669,1938468188,2001449195,1325665622,1271206113,1183200824,1111960463,1543535498,1489069629,1434599652,1363369299,622672798,568075817,748617968,677256519,907627842,853037301,1067152940,995781531,51762726,131386257,177728840,240578815,269590778,349224269,429104020,491947555,4046411278,4126034873,4172115296,4234965207,3794477266,3874110821,3953728444,4016571915,3609705398,3555108353,3735388376,3664026991,3290680682,3236090077,3449943556,3378572211,3174993278,
3120533705,3032266256,2961025959,2923101090,2868635157,2813903052,2742672763,2604032198,2683796849,2461293480,2524268063,2284983834,2364738477,2175806836,2238787779,1569362073,1498123566,1409854455,1355396672,1317987909,1246755826,1192025387,1137557660,2072149281,2135122070,1912620623,1992383480,1753615357,1816598090,1627664531,1707420964,295390185,358241886,404320391,483945776,43990325,106832002,186451547,266083308,932423249,861060070,1041341759,986742920,613929101,542559546,756411363,701822548,
3316196985,3244833742,3425377559,3370778784,3601682597,3530312978,3744426955,3689838204,3819031489,3881883254,3928223919,4007849240,4037393693,4100235434,4180117107,4259748804,2310601993,2373574846,2151335527,2231098320,2596047829,2659030626,2470359227,2550115596,2947551409,2876312838,2788305887,2733848168,3165939309,3094707162,3040238851,2985771188]),r={"-1":"Bad file checksum","-2":"Not bzip data","-3":"Unexpected input EOF","-4":"Unexpected output EOF","-5":"Data error","-6":"Out of memory","-7":"Obsolete (pre 0.9.5) bzip format not supported."};
w.prototype.N=function(){if(!this.ka())return this.v=-1,!1;this.G=new y;return!0};w.prototype.P=function(b,e){var k=new B(4);4===b.read(k,0,4)&&"BZh"===String.fromCharCode(k[0],k[1],k[2])||q(-2,"bad magic");k=k[3]-48;(1>k||9<k)&&q(-2,"level out of range");this.s=new H(b);this.h=1E5*k;this.qa=e;this.u=0};w.prototype.ka=function(){var b,e,k=this.s,m=k.ra();if("177245385090"===m)return!1;"314159265359"!==m&&q(-2);this.M=k.read(32)>>>0;this.u=(this.M^(this.u<<1|this.u>>>31))>>>0;k.read(1)&&q(-7);m=k.read(24);
m>this.h&&q(-5,"initial position out of bounds");var n=k.read(16),E=new B(256),A=0;for(b=0;16>b;b++)if(n&1<<15-b){var z=16*b;var C=k.read(16);for(e=0;16>e;e++)C&1<<15-e&&(E[A++]=z+e)}var x=k.read(3);(2>x||6<x)&&q(-5);C=k.read(15);0===C&&q(-5);z=new B(256);for(b=0;b<x;b++)z[b]=b;var N=new B(C);for(b=0;b<C;b++){for(e=0;k.read(1);e++)e>=x&&q(-5);N[b]=D(z,e)}var I=A+2,P=[];for(e=0;e<x;e++){var f=new B(I),c=new Uint16Array(21);n=k.read(5);for(b=0;b<I;b++){for(;;){(1>n||20<n)&&q(-5);if(!k.read(1))break;
k.read(1)?n--:n++}f[b]=n}var d;var h=d=f[0];for(b=1;b<I;b++)f[b]>d?d=f[b]:f[b]<h&&(h=f[b]);var a={};P.push(a);a.V=new Uint16Array(258);a.m=new Uint32Array(22);a.F=new Uint32Array(21);a.pa=h;a.oa=d;var g=0;for(b=h;b<=d;b++)for(n=c[b]=a.m[b]=0;n<I;n++)f[n]===b&&(a.V[g++]=n);for(b=0;b<I;b++)c[f[b]]++;g=n=0;for(b=h;b<d;b++)g+=c[b],a.m[b]=g-1,g<<=1,n+=c[b],a.F[b+1]=g-n;a.m[d+1]=Number.MAX_VALUE;a.m[d]=g+c[d]-1;a.F[h]=0}c=new Uint32Array(256);for(b=0;256>b;b++)z[b]=b;d=x=h=0;f=this.ma=new Uint32Array(this.h);
for(I=0;;){I--||(I=49,d>=C&&q(-5),a=P[N[d++]]);b=a.pa;for(e=k.read(b);;b++){b>a.oa&&q(-5);if(e<=a.m[b])break;e=e<<1|k.read(1)}e-=a.F[b];(0>e||258<=e)&&q(-5);b=a.V[e];if(0===b||1===b)h||(h=1,n=0),n=0===b?n+h:n+2*h,h<<=1;else{if(h)for(h=0,x+n>this.h&&q(-5),e=E[z[0]],c[e]+=n;n--;)f[x++]=e;if(b>A)break;x>=this.h&&q(-5);--b;e=D(z,b);e=E[e];c[e]++;f[x++]=e}}(0>m||m>=x)&&q(-5);for(b=e=0;256>b;b++)C=e+c[b],c[b]=e,e=C;for(b=0;b<x;b++)e=f[b]&255,f[c[e]]|=b<<8,c[e]++;n=a=k=0;x&&(k=f[m],a=k&255,k>>=8,n=-1);this.$=
k;this.Z=a;this.v=x;this.ta=n;return!0};w.prototype.O=function(){if(!(0>this.v)){for(var b=this.ma,e=this.$,k=this.Z,m=this.v,n=this.ta;m;){m--;var E=k;e=b[e];k=e&255;e>>=8;if(3===n++){var A=k;var z=E;k=-1}else A=1,z=k;for(this.G.sa(z,A);A--;)this.qa.D(z);k!=E&&(n=0)}this.v=m;this.G.T()!==this.M&&q(-5,"Bad block CRC (got "+this.G.T().toString(16)+" expected "+this.M.toString(16)+")")}};w.decode=function(b,e){b=v(b);e=t(e);for(var k=new w(b,e);!("eof"in b&&b.i());)if(k.N())k.O();else{b=k.s.read(32)>>>
0;b!==k.u&&q(-5,"Bad stream CRC (got "+k.u.toString(16)+" expected "+b.toString(16)+")");break}return e.S&&e.S()};w.table=function(b,e,k){var m=new u;m.A=v(b);m.f=0;m.o=function(){this.f++;return this.A.o()};m.A.i&&(m.i=m.A.i.bind(m.A));b=new u;b.f=0;b.D=function(){this.f++};for(var n=new w(m,b),E=n.h;!("eof"in m&&m.i());){var A=8*m.f+n.s.g;n.s.l&&(A-=8);if(n.N()){var z=b.f;n.O();e(A,b.f-z)}else if(n.s.read(32),k&&"eof"in m&&!m.i())n.P(m,b),console.assert(n.h===E,"shouldn't change block size within multistream file");
else break}};return w}();function S(t,v,w){w?self.postMessage({cmd:"resp",_id_:t,err:v,buf:w},[w]):self.postMessage({cmd:"resp",_id_:t,err:v})}self.addEventListener("message",function(t){var v=t.data;t=v._id_;switch(v.cmd){case "uz_b":v=v.buf;try{var w=R.decode(new Uint8Array(v),void 0);var q=w.buffer}catch(y){var D=y&&y.toString()}S(t,D,q);break;case "uz_g":v=v.buf;try{w=(new self.Zlib.Gunzip(new Uint8Array(v))).decompress(),q=w.buffer}catch(y){D=y&&y.toString()}S(t,D,q)}},!1);
