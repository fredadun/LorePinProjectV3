��i m p o r t   *   a s   f u n c t i o n s   f r o m   ' f i r e b a s e - f u n c t i o n s ' ;  
 i m p o r t   *   a s   a d m i n   f r o m   ' f i r e b a s e - a d m i n ' ;  
  
 / /   I n i t i a l i z e   F i r e b a s e   A d m i n  
 a d m i n . i n i t i a l i z e A p p ( ) ;  
  
  
 / /   I m p o r t   f u n c t i o n   m o d u l e s  
 i m p o r t   *   a s   a u t h F u n c t i o n s   f r o m   ' . / a u t h ' ;  
 i m p o r t   *   a s   c h a l l e n g e F u n c t i o n s   f r o m   ' . / c h a l l e n g e s ' ;  
 i m p o r t   *   a s   u s e r F u n c t i o n s   f r o m   ' . / u s e r s ' ;  
 i m p o r t   *   a s   l o r e C o i n F u n c t i o n s   f r o m   ' . / l o r e c o i n s ' ;  
  
 / /   E x p o r t   a l l   f u n c t i o n s  
 e x p o r t   c o n s t   c r e a t e U s e r P r o f i l e   =   a u t h F u n c t i o n s . c r e a t e U s e r P r o f i l e ;  
 e x p o r t   c o n s t   p r o c e s s S u b m i s s i o n   =   c h a l l e n g e F u n c t i o n s . p r o c e s s S u b m i s s i o n ;  
 e x p o r t   c o n s t   g e t U s e r P r o f i l e   =   u s e r F u n c t i o n s . g e t U s e r P r o f i l e ;  
 e x p o r t   c o n s t   a w a r d L o r e C o i n s   =   l o r e C o i n F u n c t i o n s . a w a r d L o r e C o i n s ;  
 