package main

import (
	"fmt"
)

func main() {
	/*v2 := []int{1, 2, 3, 4, 5, 6}
	v2 = append(v2, 9, 10)
	for i := 1;i < len(v2); i ++  {
		fmt.Println(i)
	}*/
	//v2 = append(v2, 9, 10)
	//fmt.Println(v2) //[1 2 3 4 5 6] len=6 cap=6
	//fmt.Println(v2[:len(v2)-3])
	//fmt.Println(v2[3:])
	//copyv := append(v2[:1],v2[3:]...) //得到删除后的切片
	//fmt.Println(copyv,len(copyv), cap(copyv))  //[1 4 5 6] len=4,cap=
	v := []string{"apple", "iphone13", "oppo", "vivo", "huawei"}
	//cool := make([]interface{}, len(v))
	//for i, v := range v {
	//	cool[i] = v
	//}
	//a := -122
	fmt.Println(In_array("vivo", v))

}

func recv(sb chan string) {
	ret := <-sb
	fmt.Println("接收成功", ret)
}
func code(a *int)  {
	*a = 800
	return
}