---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: true
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
title: Javassist
---

:::info Javassist
Javassist是一个开源的分析、编辑和创建Java字节码的类库，可以直接编辑和生成Java生成的字节码。
相对于bcel, asm等这些工具，开发者不需要了解虚拟机指令，就能动态改变类的结构，或者动态生成类。javassist简单易用， 快速。
:::

[![](https://img.shields.io/badge/%E5%AD%97%E8%8A%82%E7%A0%81%E7%BC%96%E7%A8%8B-bytecode--example-green)](https://github.com/lxchinesszz/bytecode-example)

## 一、核心工具类

|核心类|解释|
|:--|:--|
|ClassPool|javassist的类池，使用ClassPool 类可以跟踪和控制所操作的类，它的工作方式与 JVM 类装载器非常相似|
|CtClass|CtClass提供了类的操作，如在类中动态添加新字段、方法和构造函数、以及改变类、父类和接口的方法。|
|CtField|类的属性，通过它可以给类创建新的属性，还可以修改已有的属性的类型，访问修饰符等|
|CtMethod|类中的方法，通过它可以给类创建新的方法，还可以修改返回类型，访问修饰符等， 甚至还可以修改方法体内容代码|
|CtConstructor|与CtMethod类似|

## 二、API

### 2.1 ClassPool

```java 
    // 类库, jvm中所加载的class
 	ClassPool pool = ClassPool.getDefault();
	// 加载一个已知的类, 注：参数必须为全量类名
	CtClass ctClass = pool.get("com.itheima.Student");
	// 创建一个新的类, 类名必须为全量类名
	CtClass tClass = pool.makeClass("com.itheima.Calculator");
```

### 2.2 CtField

```java 
	// 获取已知类的属性
	CtField ctField = ctClass.getDeclaredField("name");
	// 构建新的类的成员变量
	CtField ctFieldNew = new CtField(CtClass.intType,"age",ctClass);
	// 设置类的访问修饰符为public
	ctFieldNew.setModifiers(Modifier.PUBLIC);
	// 将属性添加到类中
	ctClass.addField(ctFieldNew);
```

### 2.3 CtMethod

```java 
	// 获取已有方法
	//创建新的方法, 参数1:方法的返回类型，参数2：名称，参数3：方法的参数，参数4：方法所属的类
	CtMethod ctMethod = new CtMethod(CtClass.intType, "calc", new CtClass[]
{CtClass.intType,CtClass.intType}, tClass);
	// 设置方法的访问修饰
	ctMethod.setModifiers(Modifier.PUBLIC);
	// 将新建的方法添加到类中
	ctClass.addMethod(ctMethod);
	// 方法体内容代码 $1代表第一个参数，$2代表第二个参数
	ctMethod.setBody("return $1 + $2;"); 

	CtMethod ctMethod = ctClass.getDeclaredMethod("sayHello");
```

### 2.4 CtConstructor

```java 
    // 获取已有的构造方法, 参数为构建方法的参数类型数组
    CtConstructor ctConstructor = ctClass.getDeclaredConstructor(new CtClass[]{});
    // 创建新的构造方法
    CtConstructor ctConstructor = new CtConstructor(new CtClass[]{CtClass.intType},ctClass); ctConstructor.setModifiers(Modifier.PUBLIC);
    ctConstructor.setBody("this.age = $1;");
    ctClass.addConstructor(ctConstructor);
    // 也可直接创建
    ctConstructor = CtNewConstructor.make("public Student(int age){this.age=age;}", ctClass);
```

## 三、示例

```java 
public class User {

    private String name;

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    public String sayJavassist() {
        return "Hello Javassist";
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

### 3.1 修改方法

```java 
        // 类库池, jvm中所加载的class
        ClassPool pool = ClassPool.getDefault();
        // 获取指定的Student类
        CtClass ctClass = pool.get("com.example.test.User");
        // 获取sayHello方法
        CtMethod ctMethod = ctClass.getDeclaredMethod("sayJavassist");
        // 在方法的代码后追加 一段代码
        ctMethod.insertAfter("System.out.println(\"I'm Javassist.\");");
        // 使用当前的ClassLoader加载被修改后的类
        Class<?> newClass = ctClass.toClass();
        User user = (User) newClass.newInstance();
        System.out.println(user.sayJavassist());
```

### 3.2 动态添加方法

```java 
        // 类库池, jvm中所加载的class
        ClassPool pool = ClassPool.getDefault();
        // 获取指定的Student类
        CtClass ctClass = pool.get("com.example.test.User");
        // 增加方法
        CtMethod ctMethod = new CtMethod(CtClass.intType, "getAgeSum",
                new CtClass[]{CtClass.intType, CtClass.intType}, ctClass);
        // 设置方法的访问修饰
        ctMethod.setModifiers(Modifier.PUBLIC);
        // 设置方法体代码
        ctMethod.setBody("return $1 + $2;");
        // 添加新建的方法到原有的类中
        ctClass.addMethod(ctMethod);
        // 加载修改后的类
        ctClass.toClass();
        // 创建对象
        User stu = new User();
        // 获取calc方法
        Method dMethod = User.class.getDeclaredMethod("getAgeSum", new Class[]
                {int.class, int.class});
        // 反射调用 方法
        Object result = dMethod.invoke(stu, 10, 20);
        System.out.println(result);
```

### 3.3 动态创建类

```java 
        // 类库池, jvm中所加载的class
        ClassPool pool = ClassPool.getDefault();
        // 创建一个学校类
        CtClass schoolClass = pool.makeClass("com.example.test.School");
        // 设置为公有类
        schoolClass.setModifiers(Modifier.PUBLIC);
        // 获取String类型
        CtClass stringClass = pool.get("java.lang.String");
        // 获取list类型
        CtClass listClass = pool.get("java.util.List");
        // 获取学生的类型
        CtClass userClass = pool.get("com.example.test.User");
        // 给学校添加一个校名属性
        CtField nameField = new CtField(stringClass, "schoolName", schoolClass);
        nameField.setModifiers(Modifier.PUBLIC);
        schoolClass.addField(nameField);
        // 给学校添加一个学生集合
        CtField studentList = new CtField(listClass, "users", schoolClass);
        studentList.setModifiers(Modifier.PUBLIC);
        schoolClass.addField(studentList);
        // 给学校一个空构造
        CtConstructor ctConstructor = CtNewConstructor.make("public School() " +
                "{this.schoolName=\"湖畔小学\";this.users = new java.util.ArrayList();}", schoolClass);
        schoolClass.addConstructor(ctConstructor);

        // 给学校一个addUser的方法
        CtMethod m = new CtMethod(CtClass.voidType, "addUser", new CtClass[]{userClass}, schoolClass);
        m.setModifiers(Modifier.PUBLIC);
        // 添加学生对象到students属性中, $1代表参数1
        m.setBody("this.users.add($1);");
        schoolClass.addMethod(m);

        // 给学校添加一个介绍的方法
        CtMethod introduce = new CtMethod(CtClass.voidType, "introduce", new CtClass[]{}, schoolClass);
        introduce.setBody("System.out.println(\"The School name is \" + this.schoolName);");
        introduce.insertAfter("System.out.println(this.users);");
        schoolClass.addMethod(introduce);

        // 加载修改后的学校
        Class<?> schoolLoadClass = schoolClass.toClass();
        // 构建一个学校(空构造)
        Object school = schoolLoadClass.newInstance();
        // 获取添加用户方法
        Method addUserMethod = schoolLoadClass.getDeclaredMethod("addUser", userClass.toClass());
        addUserMethod.invoke(school, new User("小明"));
        addUserMethod.invoke(school, new User("小张"));
        // 获取介绍方法，把刚才的信息给打印处理
        Method introduceMethod = school.getClass().getDeclaredMethod("introduce");
        introduceMethod.invoke(school);
```

``` 
The School name is 湖畔小学
[User{name='小明'}, User{name='小张'}]
```
