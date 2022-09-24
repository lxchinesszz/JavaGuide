---
breadcrumb: false
navbar: true
sidebar: auto
pageInfo: true
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
sidebarDepth: 3
title: APT技术
---

![](https://img.springlearn.cn/blog/0d7181f253655683928c302f20fe7c1d.png)

## 一、什么是APT

`APT(Annotation Processing Tool)` 注解处理器，是 `javac` 的一个工具，他可以在源码生成class的时候,处理Java语法树。
我们用他可以干什么呢?

1. lombok的原理,在编译期修改字节码,生成 `get` 和 `set` 方法。

本文我们就使用APT技术, 来自动生成get和set方法


![](https://img.springlearn.cn/blog/3c2d07c5116dd320a8a27439c6270cf2.png)

[源码地址](https://github.com/lxchinesszz/MyLombok.git)

感兴趣的可以了解一下,不用害怕,尤其是2.6到2.7目录，不需要看到这个API就害怕。也不用死记硬背。了解就好。
正经人是不会用这个生成字节码的,字节码生成我们有很多好用的工具。

- [Javassist](/learn/tools/bytecode/Javassist/)

或者是 `javapoet`

## 二、实战演示

## 2.1 定义处理器

继承 `AbstractProcessor`

```java 
@AutoService(Processor.class)
@SupportedAnnotationTypes({"cn.lxchinesszz.MyData","cn.lxchinesszz.MyGetter","cn.lxchinesszz.MySetter"})
// 这个注解处理器是处理哪个注解的
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class MyLombokProcessor extends AbstractProcessor {

    @Override
    public synchronized void init(ProcessingEnvironment processingEnvironment) {}

    @Override
    public boolean process(Set<? extends TypeElement> set, RoundEnvironment roundEnv) {}
}
```

- @AutoService 谷歌提供的SPI工具。当使用这个注解会自定生成Java SPI文件, 当然如果不想用谷歌的工具,我们也可以自己来写配置文件

``` 
├── classes
│   ├── META-INF
│   │   └── services
│   │       └── javax.annotation.processing.Processor
```

- @SupportedAnnotationTypes({"cn.lxchinesszz.MyData","cn.lxchinesszz.MyGetter","cn.lxchinesszz.MySetter"})

支持的注解类型

- @SupportedSourceVersion(SourceVersion.RELEASE_8)

支持的源码类型

## 2.2 Element 体系

- `roundEnv.getElementsAnnotatedWith(MyData.class)` 可以获取被该注解修饰的类或者字段或者方法。

下面我们看下 `Element` 的类型。

![](https://img.springlearn.cn/blog/ca3e47d8d1707db1afb001febfd70c5a.png)

```java 
public class User{ // TypeElement

    private String name; // VariableElement
    
    private Interge age; // VariableElement
    
    public String getName(){ // ExecutableElement
        return this.name;
    }
    
    public void setName( // ExecutableElement
    String name // VariableElement
    ){
        this.name = name;
    }
}
```

如何知道Element 的类型呢。

- `Element#getKind`

![](https://img.springlearn.cn/blog/df6b6e790bcc452c9e9552ddca4e1969.png)

### 2.2.1 获取字段信息

这里我们先自定义一个字段类型来获取基础信息,来学习 `Element`

```java  
 public class FieldElement extends ModifierElement {

    /**
     * 字段名
     */
    private final String fieldName;

    /**
     * 字段类型
     */
    private Class<?> fieldType;

    /**
     * 资源原始类型
     */
    private final VariableElement fieldElement;

    /**
     * 基本类型提示
     */
    private String remark;

    /**
     * 字段所属类
     */
    private final TypeElement classElement;

    public FieldElement(String fieldName, VariableElement fieldElement) {
        super(fieldElement);
        this.fieldName = fieldName;
        this.fieldElement = fieldElement;
        this.classElement = (TypeElement) fieldElement.getEnclosingElement();
        try {
            if (isPrimitive()) {
                fieldType = null;
                this.remark = "基本类型:" + fieldElement.asType().toString();
            } else {
                this.fieldType = Class.forName(fieldElement.asType().toString());
            }
        } catch (ClassNotFoundException e) {
            // 如果还报错说明是一个泛型 根据泛型类型来进行处理 fieldElement.asType()
            // DeclaredType    Set<String>
            // WildcardType
            //    ?
            //    ? extends Number
            //    ? super T
            this.fieldType = Object.class;
        }
    }  
 }   
```

- 首先先判断是字段类型

```java 
   public static FieldElement toFiledElement(Element enclosedElement) {
        if (ElementKind.FIELD.equals(enclosedElement.getKind())) {
            VariableElement fieldElement = (VariableElement) enclosedElement;
            Name simpleName = fieldElement.getSimpleName();
            return new FieldElement(simpleName.toString(), fieldElement);
        } else {
            throw new RuntimeException("enclosedElement 不是字段类型:" + enclosedElement);
        }
    }
    
```

### 2.2.1 获取方法信息

- 方法包括方法参数和返回值,这里我们自定义一个方法参数。

```java 
public class MethodElement extends ModifierElement{

    /**
     * 方法参数名
     */
    private final String methodName;

    /**
     * 返回值
     */
    private Class<?> returnType;

    /**
     * 方法原始信息
     */
    private final ExecutableElement methodElement;

    /**
     * 方法参数
     */
    private final List<MethodParamElement> methodParamElements;

    public MethodElement(ExecutableElement methodElement, List<MethodParamElement> methodParamElements) {
        super(methodElement);
        this.methodName = methodElement.getSimpleName().toString();
        try {
            TypeMirror returnTypeMirror = methodElement.getReturnType();
            if (returnTypeMirror instanceof NoType) {
                this.returnType = Void.TYPE;
            } else {
                this.returnType = Class.forName(methodElement.getReturnType().toString());
            }
        } catch (ClassNotFoundException e) {
            this.returnType = Void.TYPE;
        }
        this.methodElement = methodElement;
        this.methodParamElements = methodParamElements;
    }
}    
```

- 生成方法

```java 
    public static MethodParamElement toMethodParamElement(Element enclosedElement) {
        if (ElementKind.PARAMETER.equals(enclosedElement.getKind())) {
            VariableElement fieldElement = (VariableElement) enclosedElement;
            Name simpleName = fieldElement.getSimpleName();
            return new MethodParamElement(simpleName.toString(), fieldElement);
        } else {
            throw new RuntimeException("enclosedElement 不是字段类型:" + enclosedElement);
        }
    }

    public static MethodElement toMethodElement(Element enclosedElement) {
        if (ElementKind.METHOD.equals(enclosedElement.getKind())) {
            ExecutableElement methodElement = (ExecutableElement) enclosedElement;
            List<? extends VariableElement> parameters = methodElement.getParameters();
            List<MethodParamElement> paramElements = new ArrayList<>();
            for (VariableElement parameter : parameters) {
                paramElements.add(toMethodParamElement(parameter));
            }
            return new MethodElement(methodElement, paramElements);
        } else {
            throw new RuntimeException("enclosedElement 不是方法类型:" + enclosedElement.getClass());
        }
    }
```

### 2.2.2 获取类信息

类信息包括字段和方法

```java 
public class ClassElement extends ModifierElement {

    /**
     * 类名称
     */
    private final String className;

    /**
     * 包名称
     */
    private final String packageName;

    /**
     * 类原始信息
     */
    private final TypeElement classElement;

    /**
     * 字段信息
     */
    private final List<FieldElement> fieldElements;

    /**
     * 方法信息
     */
    private final List<MethodElement> methodElements;

    public ClassElement(Element enclosedElement, List<FieldElement> fieldElements, List<MethodElement> methodElements) {
        super(enclosedElement);
        this.classElement = (TypeElement) enclosedElement;
        this.fieldElements = fieldElements;
        this.methodElements = methodElements;
        this.className = classElement.getSimpleName().toString();
        this.packageName = classElement.getQualifiedName().toString().replaceAll("\\." + classElement.getSimpleName().toString(), "");
    }
}    
```

生成类信息

```java 
public static ClassElement toClassElement(Element enclosedElement) {
    if (ElementKind.CLASS.equals(enclosedElement.getKind())) {
        List<? extends Element> enclosedElements = enclosedElement.getEnclosedElements();
        List<FieldElement> fieldElements = new ArrayList<>();
        List<MethodElement> methodElements = new ArrayList<>();
        for (Element element : enclosedElements) {
            if (ElementKind.FIELD.equals(element.getKind())) {
                fieldElements.add(toFiledElement(element));
            }
            if (ElementKind.METHOD.equals(element.getKind())) {
                methodElements.add(toMethodElement(element));
            }
        }
        return new ClassElement(enclosedElement, fieldElements, methodElements);
    } else {
        throw new RuntimeException("enclosedElement 不是字段类型:" + enclosedElement);
    }
}

```

## 2.3 日志打印

APT方法中日志的打印,要使用工具。在初始化方法中获取消息打印实例。

```java 
public class MyLombokProcessor extends AbstractProcessor {
    private Messager message;

     @Override
    public synchronized void init(ProcessingEnvironment processingEnvironment) {
        super.init(processingEnvironment);
        message = processingEnvironment.getMessager();
    }

    @Override
    public boolean process(Set<? extends TypeElement> set, RoundEnvironment roundEnv) {
        //	扫描所有被@MyData注解的元素
        processingEnv.getMessager().printMessage(NOTE, "------------MyData-----------" + roundEnv.getElementsAnnotatedWith(MyData.class));
    }
}
```

就想log日志一样,他也是有消息类型的,如: 提示、异常、警告等。如下枚举

```java 
/**
 * 诊断类型，例如错误或警告。诊断的类型可用于确定应如何将诊断呈现给用户。例如，错误可能被涂成红色或以“错误”一词为前缀，
 * 而警告可能被涂成黄色或以“警告”一词为前缀。没有要求 Kind 应该对诊断消息暗示任何固有的语义含义：例如，一个工具可能会
 * 提供一个选项来将所有警告报告为错误。
 */
enum Kind {
   /**
    * 阻止工具正常完成编译
    */
   ERROR,
   /**
    * 警告
    */
   WARNING,
   /**
    * 类似于警告的问题，但由工具规范强制要求。例如，Java™ 语言规范要求对某些未经检查的操作和使用过时的方法发出警告。
    */
   MANDATORY_WARNING,
   /**
    * 来自该工具的信息性消息。
    */
   NOTE,
   /**
    * 其他类型的诊断
    */
   OTHER,
    }
```

## 2.4 字节码修改

字节码修改首先我们要拿到字节码语法树对象,通过观察者模式类进行修改。这里也在初始化时候获取工具。
如下我们先定义一个工具。

```java 
public class ClassElementBuilder {
    
    private ProcessingEnvironment processingEnv;

    private JavacTrees trees;

    protected Names names;

    protected TreeMaker treeMaker;


    public ClassElementBuilder(ProcessingEnvironment processingEnv) {
        Context context = ((JavacProcessingEnvironment) processingEnv).getContext();
        this.processingEnv = processingEnv;
        this.trees = JavacTrees.instance(processingEnv);
        this.treeMaker = TreeMaker.instance(context);
        this.names = Names.instance(context);
    }
}    
```

处理器初始化方法进行工具的实例化。

```java 
 @Override
 public synchronized void init(ProcessingEnvironment processingEnvironment) {
     super.init(processingEnvironment);
     this.classElementBuilder = new ClassElementBuilder(processingEnvironment);
 }
```

此时我们就能对添加和修改语法树了。但是这里我们先不着急, 我们在先学习一下语法树的API。



## 2.5 JCTree 语法树


### 2.5.1 定义字段

**定义变量使用**

- TreeMaker#VarDef(JCTree.JCModifiers 字段修饰符,Names 字段名,JCExpression 字段类型,JCExpression 赋值语句)

```java 
private String ${fieldName};
private JCTree.JCVariableDecl generateStringField(JCTree.JCClassDecl jcClassDecl, String fieldName) {
    JCTree.JCVariableDecl var = treeMaker.VarDef(
            treeMaker.Modifiers(Flags.PRIVATE),
            names.fromString(fieldName),
            treeMaker.Ident(names.fromString("String")),
            null);
    jcClassDecl.defs = jcClassDecl.defs.prepend(var);
    return var;
}

private String ${fieldName} = ${fieldName}
private JCTree.JCVariableDecl generateStringField(JCTree.JCClassDecl jcClassDecl, String fieldName) {
    // 字段的赋值语句
    JCTree.JCVariableDecl var = treeMaker.VarDef(
            treeMaker.Modifiers(Flags.PRIVATE),
            names.fromString(fieldName),
            treeMaker.Ident(names.fromString("String")),
            treeMaker.Literal(fieldName));

    jcClassDecl.defs = jcClassDecl.defs.prepend(var);
    return var;
}
```

要想理解这个API,实现要分析字段是由什么构成的,正如下图。

![](https://img.springlearn.cn/blog/9575d00387bdb30b09432288524deba4.png)


标示符三种处理方式。

1. 包装类型，不用引入包，可以直接使用

- TreeMaker#Ident
JCExpression
```java  
treeMaker.Ident(names.fromString("String"))
```

2. 基本类型，不用引入包，可以直接使用

- TreeMaker#TypeIdent
```java 
treeMaker.TypeIdent(TypeTag.INT)
```

3. 引用类型，需要引入包后再直接使用

- 先引入包，然后就向包装类型那样进行处理。

```java 
// import package
private JCTree.JCImport genImportPkg(String packageName, String className) {
    JCTree.JCIdent ident = treeMaker.Ident(names.fromString(packageName));
    return treeMaker.Import(treeMaker.Select(
            ident, names.fromString(className)), false);
}
```


### 2.5.2 定义get和set方法

生成set方法,方法是由

- 方法修饰符 `treeMaker.Modifiers(Flags.PUBLIC + Flags.STATIC + Flags.FINAL)`
- 方法名 `names.fromString("setName")`
- 方法返回值 `treeMaker#Type、treeMaker#TypeIdent`

```java 
/**
 * public void setName(String name){
 *      this.name = name;
 * }
 *
 * @param jcClassDecl 类
 * @param f           字段
 * @param fieldName   字段名
 */
private void generateSetMethod(JCTree.JCClassDecl jcClassDecl, JCTree.JCVariableDecl f, String fieldName) {
    // 方法体内容
    ListBuffer<JCTree.JCStatement> statements = new ListBuffer<>();
    // this.MyDate
    JCTree.JCFieldAccess aThis = treeMaker.Select(treeMaker.Ident(names.fromString("this")), names.fromString(fieldName));
    // this.MyDate = MyDate;
    JCTree.JCExpressionStatement exec = treeMaker.Exec(treeMaker.Assign(aThis, treeMaker.Ident(names.fromString(fieldName))));
    statements.add(exec);
    JCTree.JCBlock body = treeMaker.Block(0, statements.toList());

    // 方法参数
    JCTree.JCVariableDecl param = treeMaker.VarDef(treeMaker.Modifiers(Flags.PARAMETER), names.fromString(fieldName), f.vartype, null);
    com.sun.tools.javac.util.List<JCTree.JCVariableDecl> parameters = com.sun.tools.javac.util.List.of(param);

    JCTree.JCMethodDecl getNameMethod = treeMaker.MethodDef(
            treeMaker.Modifiers(Flags.PUBLIC),  // 方法修饰符
            names.fromString("set" + capRename(fieldName)),  // 方法名,capName转驼峰
            treeMaker.Type(new Type.JCVoidType()),  // 方法返回值类型
            List.nil(),
            parameters, // 方法参数
            List.nil(),
            body,// 方法体
            null
    );
    // 插入到语法树中
    jcClassDecl.defs = jcClassDecl.defs.prepend(getNameMethod);
}

/**
 * public void getName(){
 *    return this.name;
 * }
 *
 * @param jcClassDecl 类
 * @param f           字段
 * @param fieldName   字段名
 */
private void generateGetMethod(JCTree.JCClassDecl jcClassDecl, JCTree.JCVariableDecl f, String fieldName) {
    // 方法体内容
    ListBuffer<JCTree.JCStatement> statements = new ListBuffer<>();
    // this.name
    JCTree.JCFieldAccess select = treeMaker.Select(treeMaker.Ident(names.fromString("this")),
            names.fromString(fieldName));
    // 生成return代码 return this.name
    JCTree.JCReturn jcReturn = treeMaker.Return(select);
    statements.add(jcReturn);
    // 方法体
    JCTree.JCBlock body = treeMaker.Block(0, statements.toList());
    // 生成方法
    JCTree.JCMethodDecl getNameMethod = treeMaker.MethodDef(
            treeMaker.Modifiers(Flags.PUBLIC), // 方法修饰符
            names.fromString("get" + capRename(fieldName)), // 方法名
            f.vartype, // 方法返回值类型
            List.nil(),
            List.nil(), // 方法参数
            List.nil(),
            body, // 方法体
            null
    );
    // 插入到语法树中
    jcClassDecl.defs = jcClassDecl.defs.prepend(getNameMethod);
}
```


[参考文章](https://my.oschina.net/u/4030990/blog/3211858)

## 2.6 TreeMaker

[部分内容翻译自](https://my.oschina.net/u/4030990/blog/3211858)

### 2.6.1 Modifiers 修饰符

java中类,方法,字段都是有修饰符的。


```java 
public JCModifiers Modifiers(long flags) {
    return Modifiers(flags, List.< JCAnnotation >nil());
}

public JCModifiers Modifiers(long flags,
    List<JCAnnotation> annotations) {
        JCModifiers tree = new JCModifiers(flags, annotations);
        boolean noFlags = (flags & (Flags.ModifierFlags | Flags.ANNOTATION)) == 0;
        tree.pos = (noFlags && annotations.isEmpty()) ? Position.NOPOS : pos;
        return tree;
}
```

- 定义多个修饰符

treeMaker.Modifiers(Flags.PUBLIC + Flags.STATIC + Flags.FINAL);

### 2.6.2 ClassDef 定义类

```java 

public JCClassDecl ClassDef(JCModifiers mods, // 访问标志，可以通过 TreeMaker.Modifiers 来创建
    Name name, // 类名
    List<JCTypeParameter> typarams, // 泛型参数列表
    JCExpression extending, // 父类
    List<JCExpression> implementing, // 实现的接口
    List<JCTree> defs) { // 类定义的详细语句，包括字段、方法的定义等等
        JCClassDecl tree = new JCClassDecl(mods,
                                     name,
                                     typarams,
                                     extending,
                                     implementing,
                                     defs,
                                     null);
        tree.pos = pos;
        return tree;
}
```

### 2.6.3 MethodDef 定义方法


```java 
public JCMethodDecl MethodDef(JCModifiers mods, // mods：访问标志
    Name name, // 方法名
    JCExpression restype, // 返回类型,返回类型 restype 填写 null 或者 treeMaker.TypeIdent(TypeTag.VOID) 都代表返回 void 类型
    List<JCTypeParameter> typarams, // 泛型参数列表
    List<JCVariableDecl> params, // 参数列表
    List<JCExpression> thrown, // 异常声明列表
    JCBlock body, // 方法体
    JCExpression defaultValue // 默认方法（可能是 interface 中的哪个 default）
    ) {
        JCMethodDecl tree = new JCMethodDecl(mods,
                                       name,
                                       restype,
                                       typarams,
                                       params,
                                       thrown,
                                       body,
                                       defaultValue,
                                       null);
        tree.pos = pos;
        return tree;
}

```

### 2.6.4 VarDef 定义字段

```java 
public JCVariableDecl VarDef(JCModifiers mods, // 访问标志
    Name name, // 参数名称
    JCExpression vartype, // 类型
    JCExpression init // 初始化语句
    ) {
        JCVariableDecl tree = new JCVariableDecl(mods, name, vartype, init, null);
        tree.pos = pos;
        return tree;
}

public JCVariableDecl VarDef(VarSymbol v,
    JCExpression init) {
        return (JCVariableDecl)
            new JCVariableDecl(
                Modifiers(v.flags(), Annotations(v.getAnnotationMirrors())),
                v.name,
                Type(v.type),
                init,
                v).setPos(pos).setType(v.type);
}
```


### 2.6.5 Return 定义返回

```java 
public JCReturn Return(JCExpression expr) {
        JCReturn tree = new JCReturn(expr);
        tree.pos = pos;
        return tree;
}
```

### 2.6.6 Ident 定义关键字

- `treeMaker.Ident(names.fromString("this"))`

```java 
public JCIdent Ident(Name name) {
        JCIdent tree = new JCIdent(name, null);
        tree.pos = pos;
        return tree;
}

public JCIdent Ident(Symbol sym) {
        return (JCIdent)new JCIdent((sym.name != names.empty)
                                ? sym.name
                                : sym.flatName(), sym)
            .setPos(pos)
            .setType(sym.type);
}

public JCExpression Ident(JCVariableDecl param) {
        return Ident(param.sym);
}
```


### 2.6.7 Select 

TreeMaker.Select 用于创建域访问 / 方法访问

```java 
public JCFieldAccess Select(JCExpression selected,
    Name selector) 
{
        JCFieldAccess tree = new JCFieldAccess(selected, selector, null);
        tree.pos = pos;
        return tree;
}

public JCExpression Select(JCExpression base,
    Symbol sym) {
        return new JCFieldAccess(base, sym.name, sym).setPos(pos).setType(sym.type);
}
```

两个参数第一个是对象，第二个是对象的那个方法。

- this.${fieldName}

```java 
        JCTree.JCFieldAccess aThis = treeMaker.Select(treeMaker.Ident(names.fromString("this")), names.fromString(fieldName));
```


### 2.6.8 NewClass 

用于创建 new 语句语法树节点（JCNewClass）


```java
public JCNewClass NewClass(JCExpression encl,
    List<JCExpression> typeargs, // 参数类型列表
    JCExpression clazz, // 待创建对象的类型
    List<JCExpression> args, // 参数列表
    JCClassDecl def) { // 类定义
        JCNewClass tree = new JCNewClass(encl, typeargs, clazz, args, def);
        tree.pos = pos;
        return tree;
}
```

### 2.6.9 Assign 赋值语句

类似 Select, 如果说Select是 `.` 
那么Assign是 `=`

```java
public JCAssign Assign(JCExpression lhs,
    JCExpression rhs) {
    JCAssign tree = new JCAssign(lhs, rhs);
    tree.pos = pos;
    return tree;
}
```

select和assign配合使用

```java 
        // this.MyDate
        JCTree.JCFieldAccess aThis = treeMaker.Select(treeMaker.Ident(names.fromString("this")), names.fromString(fieldName));
        // this.MyDate = MyDate;
        JCTree.JCExpressionStatement exec = treeMaker.Exec(treeMaker.Assign(aThis, treeMaker.Ident(names.fromString(fieldName))));
      
```

### 2.6.10 Exec执行语句

配合赋值语句使用

```java 
public JCExpressionStatement Exec(JCExpression expr) {
        JCExpressionStatement tree = new JCExpressionStatement(expr);
        tree.pos = pos;
        return tree;
}

```

### 2.6.11 Apply 方法调用

```java 
// 创建一个方法调用 user.say("hello world!");
JCTree.JCExpressionStatement exec2 = treeMaker.Exec(
        treeMaker.Apply(
                com.sun.tools.javac.util.List.nil(),
                treeMaker.Select(
                        treeMaker.Ident(names.fromString("user")), // . 左边的内容
                        names.fromString("say") // . 右边的内容
                ),
                com.sun.tools.javac.util.List.of(treeMaker.Literal("hello world!")) // 方法中的内容
        )
);
```

## 2.7 代码片段

2.6的API,是真的难用,这里列几个片段。

### 2.7.1 生成字段

- `private String age;`

```java 
// 生成参数 例如：private String age;
treeMaker.VarDef(treeMaker.Modifiers(Flags.PRIVATE), names.fromString("age"), treeMaker.Ident(names.fromString("String")), null);
```

### 2.7.2 赋值变量

- `private String name = "西魏陶渊明"`

```java 
treeMaker.VarDef(treeMaker.Modifiers(Flags.PRIVATE),names.fromString("name"),treeMaker.Ident(names.fromString("String")),treeMaker.Literal("西魏陶渊明"))

```

### 2.7.3 相加

- `JCTree.Tag.PLUS`

```java 
treeMaker.Exec(treeMaker.Assign(treeMaker.Ident(names.fromString("add")),treeMaker.Binary(JCTree.Tag.PLUS,treeMaker.Literal("a"),treeMaker.Literal("b"))))
```

### 2.7.4 += 语法

- `JCTree.Tag.PLUS_ASG`

```java 
treeMaker.Exec(treeMaker.Assignop(JCTree.Tag.PLUS_ASG, treeMaker.Ident(names.fromString("add")),
treeMaker.Literal("test")))
```

### 2.7.5 ++ 语法

```java 
treeMaker.Exec(treeMaker.Unary(JCTree.Tag.PREINC,treeMaker.Ident(names.fromString("i"))))
```

### 2.7.6 If语句

```java 
/*
    创建一个if语句
    if("BuXueWuShu".equals(name)){
        add = "a" + "b";
    }else{
        add += "test";
    }
 */
// "BuXueWuShu".equals(name)
JCTree.JCMethodInvocation apply = treeMaker.Apply(
        com.sun.tools.javac.util.List.nil(),
        treeMaker.Select(
                treeMaker.Literal("BuXueWuShu"), // . 左边的内容
                names.fromString("equals") // . 右边的内容
        ),
        com.sun.tools.javac.util.List.of(treeMaker.Ident(names.fromString("name")))
);
//  add = "a" + "b"
JCTree.JCExpressionStatement exec3 = treeMaker.Exec(treeMaker.Assign(treeMaker.Ident(names.fromString("add")), treeMaker.Binary(JCTree.Tag.PLUS, treeMaker.Literal("a"), treeMaker.Literal("b"))));
//  add += "test"
JCTree.JCExpressionStatement exec1 = treeMaker.Exec(treeMaker.Assignop(JCTree.Tag.PLUS_ASG, treeMaker.Ident(names.fromString("add")), treeMaker.Literal("test")));

JCTree.JCIf anIf = treeMaker.If(
        apply, // if语句里面的判断语句
        exec3, // 条件成立的语句
        exec1  // 条件不成立的语句
);

```
