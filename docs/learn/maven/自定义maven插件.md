---
breadcrumb: false
navbar: true
sidebar: auto
pageInfo: false
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
title: 自定义插件教程
password: 111
icon: zuanshi
---

> Maven插件官网: https://maven.apache.org/guides/plugin/guide-java-plugin-development.html

::: info 前言介绍
前面我们大概了解了Maven的生命周期,本篇主要是学习如何在Maven的生命周期内指定一些插件的执行。主要分为3个步骤。<br>
 <Badge text="1" type="tip" vertical="middle"/> 第一个步骤先了解学习下Maven官方的命名规则建议。<br>
 <Badge text="2" type="tip" vertical="middle"/> 第二个步骤根据命名规则,我们自定义一个插件 Mojo。<br>
 <Badge text="3" type="tip" vertical="middle"/> 第三个部分学习如何向插件内 Mojo 注入一些，Maven的配置和自定义的配置信息。<br>
:::


## 一、命名规范

- 官方的命名规则: `maven-<yourplugin>-plugin`（注意“Maven”位于插件名称的开头)
- 个人自定义建议: `<yourplugin>-maven-plugin`（注意“Maven”位于插件名称的中间)

个人不得使用官方命名规则,因为它是 Apache Maven 团队使用的插件保留命名模式。
如果个人使用这种命名模式是会侵犯了 Apache Maven 商标。`org.apache.maven.plugins`


## 二、自定义插件

当我们使用idea创建一个maven插件,里面已经为我们创建了一个Mojo。定义Mojo首先要集成
`AbstractMojo` 抽象类。另外要声明这个Mojo的名字和Maven执行阶段。有两种方法声明

[mojo-api-specification](https://maven.apache.org/developers/mojo-api-specification.html)

### 2.1 使用javadoc的方式声明

因为maven诞生比较早,当时没有注解。所以使用了javadoc。

[Maven Plugin Tool for Java Annotated with Mojo Javadoc Tags](https://maven.apache.org/plugin-tools/maven-plugin-tools-java/index.html)


```java
/**
* Goal which touches a timestamp file.
*
* @goal touch
* @phase process-sources
*/
public class MyMojo extends AbstractMojo {

    @Override
    public void execute()
    throws MojoExecutionException {
    getLog().info("我是一个Maven插件: FirstDemo");
    }
}
```

指定mvn install 安装到本地仓库,然后找个项目执行一下。

```
[INFO] Scanning for projects...
[INFO]
[INFO] ---------------------< org.example:nobug-learn-01 >---------------------
[INFO] Building nobug-learn-01 1.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- firstdemo-maven-plugin:1.0-SNAPSHOT:touch (default-cli) @ nobug-learn-01 ---
[INFO] 我是一个Maven插件: FirstDemo
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.296 s
[INFO] Finished at: 2021-11-26T17:00:32+08:00
[INFO] ------------------------------------------------------------------------
```

### 2.2 使用注解的方式

前面使用javadoc的形式来定义缺失有点显得过时了,现在我们可以使用注解的方式来定义插件。但是首先需要引入注解包
下面这些依赖直接拷贝进去就行，注意如果你的maven版本太低，可能会识别不了注解。所以建议制定下构建插件的maven为
3.5

[Maven Plugin Tools Java5 Annotations](https://maven.apache.org/plugin-tools/maven-plugin-tools-annotations/index.html)

使用 @Mojo 注解定义插件, Mojo中有一个非常重要的属性需要知道下。

|属性值|说明|
|:--:|:--:|
|name|插件名称|
|defaultPhase|绑定的声明周期|
|requiresDependencyResolution|在插件运行之前就将所有的依赖模块给构建好|
|requiresDependencyCollection|这个注解不会解析依赖项的文件,只分析依赖关系|

建议requiresDependencyCollection是要指定的,不然你得到的maven插件中,是不会分析依赖关系的。


==下面的依赖建议你直接拷贝使用==

- 注意第一行一定不能忘记

```xml {1} 
    <packaging>maven-plugin</packaging> 
    <properties>
        <dep.maven-api.version>3.5.2</dep.maven-api.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-plugin-api</artifactId>
            <version>${dep.maven-api.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-model</artifactId>
            <version>${dep.maven-api.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.maven.plugin-tools</groupId>
            <artifactId>maven-plugin-annotations</artifactId>
            <version>${dep.maven-api.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-plugin-plugin</artifactId>
            <version>3.5</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>3.8.1</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-core</artifactId>
            <version>3.8.5</version>
        </dependency>
    </dependencies>
   <!--注意这一步也非常重要，否则如果你系统的maven版本太低，就可能无法识别maven的注解-->
    <build>
    <plugins>
     <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-plugin-plugin</artifactId>
      <version>3.5</version>
     </plugin>
    </plugins>
    </build>
```

Mojo类
```java
@Mojo(name = "myMojo", defaultPhase = LifecyclePhase.VALIDATE, threadSafe = true)
@Execute(phase = LifecyclePhase.VALIDATE)
public class MyMojo
        extends AbstractMojo {

    public void execute()
            throws MojoExecutionException {
        getLog().info("我是一个Maven插件: FirstDemo");
    }
}
```

注意: 自定义的maven插件是没办法直接就执行的，一定要在build中指定要执行的mojo。如下代码。

```
<plugin>
    <groupId>org.example</groupId>
    <artifactId>firstdemo-maven-plugin</artifactId>
    <version>1.2-SNAPSHOT</version>
    <executions>
        <execution>
        <!--                        如果插件中没有生命周期,这里要进行声明。如果插件中声明了就不用写这个-->
         <phase>clean</phase>
         <goals>
         <!--                            自定义的插件,不会自动执行,要在这里进行声明-->
            <goal>myMojo</goal>
        </goals>
        </execution>
    </executions>
</plugin>
```





## 三、参数注入

maven插件中是可以自定以参数的,通过配置然后传递到Mojo类中。 主要使用 `@Parameter` 注解完成，下面是详细介绍。



主要使用`@Parameter`进行定义。

| 字段         | 说明                       |
| ------------ | -------------------------- |
| name         | 声明参数的名字             |
| alias        | 声明一个别名               |
| property     | 从pom的propertys标签中读取,或是-Dtest=123 使用-D添加到命令行 |
| defaultValue | 字段的默认值               |
| required     | 是否必须                   |
| readonly     | 是否只读                   |

字段的类型可以是多样的。

## 3.1 外部参数注入


### 3.1.1 boolean类型

这包括类型为 boolean 和 Boolean 的变量。 读取配置时，文本“true”会导致参数设置为 true，所有其他文本都会导致参数设置为 false。 例子：

```
    /**
     * My boolean.
     */
    @Parameter
    private boolean myBoolean;
```

`<myBoolean>true</myBoolean>`

### 3.1.2 Integer类型

这包括类型为 byte、Byte、int、Integer、long、Long、short 和 Short 的变量。 读取配置时，使用 Integer.parseInt() 或相应类的 valueOf() 方法将 XML 文件中的文本转换为整数值。 这意味着字符串必须是有效的十进制整数值，仅由数字 0 到 9 组成，前面有一个可选的 - 表示负值。 例子：

```
    /**
     * My Integer.
     */
    @Parameter
    private Integer myInteger;
```

`<myInteger>10</myInteger>`

### 3.1.3 Double类型
这包括类型为 double、Double、float 和 Float 的变量。 读取配置时，XML 文件中的文本使用相应类的 valueOf() 方法转换为二进制形式。
```
    /**
     * My Double.
     */
    @Parameter
    private Double myDouble;
```

`<myDouble>1.0</myDouble>`

### 3.1.4 Date类型

这包括类型为日期的变量。 读取配置时，XML 文件中的文本使用以下日期格式之一进行转换：“yyyy-MM-dd HH:mm:ss.S a”（示例日期为“2005-10-06 2:22 :55.1 PM”）或“yyyy-MM-dd HH:mm:ssa”（示例日期为“2005-10-06 2:22:55PM”）。 请注意，解析是使用 DateFormat.parse() 完成的，它允许对格式进行一些宽容。 如果该方法可以解析指定的日期和时间，即使它与上面的模式不完全匹配，它也会这样做。 例子：

```
    /**
     * My Date.
     */
    @Parameter
    private Date myDate;
```

`<myDate>2005-10-06 2:22:55.1 PM</myDate>`

### 3.1.5 File类型
这包括类型为 File 的变量。 读取配置时，XML 文件中的文本用作所需文件或目录的路径。 如果路径是相对的（不以 / 或 C: 之类的驱动器号开头），则该路径是相对于包含 POM 的目录。 例子：
```
    /**
     * My File.
     */
    @Parameter
    private File myFile;
```

`<myFile>c:\temp</myFile>`

### 3.1.6 URL

这包括变量类型的 URL。 读取配置时，使用 XML 文件中的文本作为 URL。 格式必须遵循 RFC 2396 准则，并且看起来像任何 Web 浏览器 URL (scheme://host:port/path/to/file)。 转换 URL 时，对 URL 任何部分的内容都没有限制。

```
    /**
     * My URL.
     */
    @Parameter
    private URL myURL;
```

`<myURL>http://maven.apache.org</myURL>`

### 3.1.7 枚举

也可以使用枚举类型参数。 首先你需要定义你的枚举类型，然后你可以在参数定义中使用枚举类型：
```
    public enum Color {
      GREEN,
      RED,
      BLUE
    }

    /**
     * My Enum
     */
    @Parameter
    private Color myColor;
```

`<myColor>GREEN</myColor>`

### 3.1.8 Arrays

```
    /**
     * My Array.
     */
    @Parameter
    private String[] myArray;
```

```
<myArray>
  <param>value1</param>
  <param>value2</param>
</myArray>
```

### 3.1.9 Collections

此类别涵盖任何实现 java.util.Collection 的类，例如 ArrayList 或 HashSet。 这些参数是通过多次指定参数来配置的，就像数组一样。 例子：

```
   /**
     * My List.
     */
    @Parameter
    private List myList;
```

```
<myList>
  <param>value1</param>
  <param>value2</param>
</myList>
```

### 3.1.10 Maps

此类别涵盖任何实现 java.util.Map（例如 HashMap）但未实现 java.util.Properties 的类。 这些参数是通过在参数配置中以 <key>value</key> 形式包含 XML 标签来配置的。 例子：

```
    /**
     * My Map.
     */
    @Parameter
    private Map myMap;
```

```
<myMap>
  <key1>value1</key1>
  <key2>value2</key2>
</myMap>
```

### 3.1.11 Properties

此类别涵盖实现 java.util.Properties 的任何地图。 这些参数是通过在参数配置中以 <property><name>myName</name> <value>myValue</value> </property> 形式包含 XML 标记来配置的。 例子：

```
    /**
     * My Properties.
     */
    @Parameter
    private Properties myProperties;
```


```
<myProperties>
  <property>
    <name>propertyName1</name>
    <value>propertyValue1</value>
  <property>
  <property>
    <name>propertyName2</name>
    <value>propertyValue2</value>
  <property>
</myProperties>
```

### 3.1.12 Object

```
    /**
     * My Object.
     */
    @Parameter
    private MyObject myObject;
```

```
<myObject>
  <myField>test</myField>
</myObject>
```


## 3.2 Maven组件注入

### 3.2.1 MavenSession

包含Maven执行请求对象和结果,当前模块和总模块。和依赖模块信息等信息

```
    @Parameter(defaultValue = "${session}", readonly = true)
    private MavenSession session;
```

### 3.2.2 MavenProject

当前模块，及模块依赖

```
    @Parameter(defaultValue = "${project}", readonly = true)
    private MavenProject project;
```
### 3.2.3 MojoExecution

```
    @Parameter(defaultValue = "${mojoExecution}", readonly = true)
    private MojoExecution mojo;
```

### 3.2.4 PluginDescriptor

```
    @Parameter(defaultValue = "${plugin}", readonly = true)
    private PluginDescriptor plugin;
```

### 3.2.5 Settings

```
    /**
     * maven的配置信息
     */
    @Parameter(defaultValue = "${settings}", readonly = true)
    private Settings settings;
```


### 3.2.6. 项目路径

```
    /**
     * 项目路径
     */
    @Parameter(defaultValue = "${project.basedir}", readonly = true)
    private File basedir;
```

### 3.2.7. 编译后目录

```
    /**
     * 编译后目录
     */
    @Parameter(defaultValue = "${project.build.directory}", readonly = true)
    private File target;
```

## 四、插件执行

> 类似问题: https://www.coder.work/article/3592058

::: danger 注意
我们自己开发的插件,要想执行必须要在项目的pom文件中来指定,插件不会默认来进行执行的。如下。
:::

```
<plugin>
    <groupId>org.example</groupId>
    <artifactId>firstdemo-maven-plugin</artifactId>
    <version>1.2-SNAPSHOT</version>
    <executions>
        <execution>
        <!--                        如果插件中没有生命周期,这里要进行声明。如果插件中声明了就不用写这个-->
         <phase>clean</phase>
         <goals>
         <!--                            自定义的插件,不会自动执行,要在这里进行声明-->
            <goal>myMojo</goal>
        </goals>
        </execution>
    </executions>
</plugin>
```

- [x] phase 如果插件中没有生命周期,这里要进行声明。如果插件中声明了就不用写这个
- [x] goal  自定义的插件,不会自动执行,要在这里进行声明


### 命令行执行

- `mvn org.example:firstdemo-maven-plugin:1.4-SNAPSHOT:myMojo`

- `mvn ${groupId}:${artifactId}:${version}:${mojoName}`
