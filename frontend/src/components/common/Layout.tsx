��i m p o r t   R e a c t   f r o m   ' r e a c t ' ;  
 i m p o r t   H e a d e r   f r o m   ' @ / c o m p o n e n t s / c o m m o n / H e a d e r ' ;  
 i m p o r t   F o o t e r   f r o m   ' @ / c o m p o n e n t s / c o m m o n / F o o t e r ' ;  
  
 i n t e r f a c e   L a y o u t P r o p s   {  
     c h i l d r e n :   R e a c t . R e a c t N o d e ;  
 }  
  
 / * *  
   *   L a y o u t   c o m p o n e n t   t h a t   w r a p s   a l l   p a g e s  
   *   I n c l u d e s   t h e   H e a d e r   a n d   F o o t e r   c o m p o n e n t s  
   * /  
 c o n s t   L a y o u t :   R e a c t . F C < L a y o u t P r o p s >   =   ( {   c h i l d r e n   } )   = >   {  
     r e t u r n   (  
         < d i v   c l a s s N a m e = \  
 f l e x  
 f l e x - c o l  
 m i n - h - s c r e e n \ >  
             < H e a d e r   / >  
             < m a i n   c l a s s N a m e = \  
 f l e x - g r o w \ > { c h i l d r e n } < / m a i n >  
             < F o o t e r   / >  
         < / d i v >  
     ) ;  
 } ;  
  
 e x p o r t   d e f a u l t   L a y o u t ;  
 