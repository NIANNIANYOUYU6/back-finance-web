export const tranNumber = (number, point) => {
   // 避免undefind出现
   const num = +number || 0
   // 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
   let numStr = num.toString().split('.')[0]
   if(numStr.length<5) { // 判断数字有多长,如果小于6,,表示10万以内的数字,让其直接显示
      return (+num).toFixed(point);
    }else if(numStr.length>=5 && numStr.length<=7){ // 如果数字大于6位,小于8位,让其数字后面加单位万
      let decimal = numStr.substring(numStr.length-3, numStr.length-3+point)
      // 由千位,百位组成的一个数字
      return parseFloat(parseInt(num / 1000)+'.'+decimal)+'K'  
   }else if(numStr.length >7 && numStr.length<=10){ // 如果数字大于8位,让其数字后面加单位亿
      let decimal = numStr.substring(numStr.length-6, numStr.length-6+point);
      return parseFloat(parseInt(num/1000000)+'.'+decimal)+'M'
   }
   else if(numStr.length > 10){ // 如果数字大于8位,让其数字后面加单位亿
      let decimal = numStr.substring(numStr.length-9, numStr.length-9+point);
      return parseFloat(parseInt(num/1000000000)+'.'+decimal)+'B'
   }
}