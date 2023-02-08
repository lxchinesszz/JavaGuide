---
breadcrumb: false
navbar: true
sidebar: true
pageInfo: true
contributor: false
editLink: true
updateTime: true
prev: true
next: true
comment: true
footer: true
backtotop: true
title: 第04篇:Resources资源文件
category: Spring Framework
image: https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png
---


![](https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！

![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)


## 一、前言

Java 的java.net.URL各种 URL 前缀的标准类和标准处理程序不足以满足所有对低级资源的访问。例如，没有URL可用于访问需要从类路径或相对于ServletContext。于是乎这就给了Spring,封装继承多态,大展身手的展示了。怎么展示呢?

在Spring中就是 `Resource` 接口,下面我们就看看 `Resource`。


我们利用Spring提供的能力,可以获取任何你想获取的文件,也可以使用通配符来模糊查询你要的文件。下面开始展示。


## 二、代码实例

## 2.1 接口定义

```java
public interface Resource extends InputStreamSource {
    // 确定此资源是否实际以物理形式存在
    boolean exists();
    // 是否可以通过getInputStream()读取此资源的非空内容。
    boolean isReadable();
    // 指示此资源是否表示具有打开流的句柄。如果为true ，则 InputStream 不能被多次读取，必须被读取并关闭以避免资源泄漏。
    boolean isOpen();
    // 确定此资源是否代表文件系统中的文件。 
    boolean isFile();
    // 返回此资源的 URL 句柄。
    URL getURL() throws IOException;
    // 返回此资源的 URI 句柄。
    URI getURI() throws IOException;
    // 返回此资源的文件句柄
    File getFile() throws IOException;
    // 预计每次通话都会创建一个新频道。
    ReadableByteChannel readableChannel() throws IOException;
    // 确定此资源的内容长度。
    long contentLength() throws IOException;
    // 确定此资源的最后修改时间戳。
    long lastModified() throws IOException;
    // 创建与此资源相关的资源 relativePath – 相对路径（相对于该资源）
    Resource createRelative(String relativePath) throws IOException;
    // 确定此资源的文件名，即通常是路径的最后部分：例如，“myfile.txt”。
    String getFilename();
    // 返回此资源的描述，用于在使用资源时输出错误。
    String getDescription();
}
```

## 2.2 内置Resource实现

Spring 包括几个内置的Resource实现：

![](https://img.springlearn.cn/blog/aec5094c4b2437e274d2b222c0f969d9.png)

### 2.2.1 UrlResource

UrlResource包装 ajava.net.URL并可用于访问通常可通过 URL 访问的任何对象，例如文件、HTTPS 目标、FTP 目标等。所有 URL 都有一个标准化的String表示，因此使用适当的标准化前缀来指示一个 URL 类型与另一个 URL 类型。这包括 file:访问文件系统路径、https:通过 HTTPS 协议ftp:访问资源、通过 FTP 访问资源等。


UrlResource是由 Java 代码通过显式使用UrlResource构造函数创建的，但通常是在调用 API 方法时隐式创建的。

```java
  AnnotationConfigApplicationContext cxt = new AnnotationConfigApplicationContext();
  Resource urlResource = cxt.getResource("https://dev.springlearn.cn/_assets/style.f6b20991.css");
```

### 2.2.2 ClassPathResource


此类表示应从类路径获取的资源。它使用线程上下文类加载器、给定的类加载器或给定的类来加载资源。

ClassPathResource是由 Java 代码通过显式使用ClassPathResource 构造函数创建的，但通常是在调用 API 方法时隐式创建的。


```java
Resource classPathContextResource = cxt.getResource("application.yml");
Resource classPathResource = cxt.getResource("classpath:application.yml");
```

### 2.2.3 FileSystemResource

java.io.File它还支持 java.nio.file.Path句柄，应用 Spring 的标准基于字符串的路径转换，但通过java.nio.file.FilesAPI 执行所有操作。对于纯 java.nio.path.Path基于支持，请改用 a PathResource。

```java
FileSystemResource fileSystemResource1 = new FileSystemResource("/Users/lx/Github/learn-example/learn-spring/src/main/resources/a.txt");

 Path path = Paths.get("/Users/lx/Github/learn-example/learn-spring/src/main/resources/a.txt");
 FileSystemResource fileSystemResource2 = new FileSystemResource(path);
```


### 2.2.4 PathResource

对于纯 java.nio.path.Path基于支持

```java
Path path = Paths.get("/Users/liuxin/Github/learn-example/learn-spring/src/main/resources/a.txt");
PathResource pathResource = new PathResource(path);
```


### 2.2.5 ServletContextResource

Web 应用程序根目录中的相对路径Resource的资源实现。ServletContext

它始终支持流访问和 URL 访问，但java.io.File仅在扩展 Web 应用程序存档且资源物理位于文件系统上时才允许访问。它是否被扩展并在文件系统上或直接从 JAR 或其他地方（如数据库）访问（这是可以想象的）实际上取决于 Servlet 容器。


### 2.2.6 InputStreamResource

InputStreamResource是Resource给定 的实现InputStream。Resource只有在没有特定实现适用时才应使用它。特别是，在可能的情况下，首选ByteArrayResource实现。

与其他Resource实现相比，这是一个已打开资源的描述符。因此isOpen()=true. 如果您需要将资源描述符保存在某处或需要多次读取流，请不要使用它。

### 2.2.7 ByteArrayResource

这是Resource给定字节数组的实现,它对于从任何给定的字节数组加载内容很有用，而不必求助于单次使用InputStreamResource


## 2.3 处理策略

前面我们看了,Spring中内置了很多的实现,但是难道我们要自己来判断使用哪个吗? 当时是不需要的。我们直接使用 `AnnotationConfigApplicationContext#getResource`。而具体使用哪个实现我们看底层的处理逻辑。

这段逻辑是在 `DefaultResourceLoader` 中处理的。

```java
@Override
	public Resource getResource(String location) {
		Assert.notNull(location, "Location must not be null");
    // 系统中是否有自己的解析处理器,这里可以自定义协议处理器。
		for (ProtocolResolver protocolResolver : getProtocolResolvers()) {
			Resource resource = protocolResolver.resolve(location, this);
			if (resource != null) {
				return resource;
			}
		}
    // new ClassPathContextResource()
		if (location.startsWith("/")) {
			return getResourceByPath(location);
		}
    // new ClassPathResource()
		else if (location.startsWith(CLASSPATH_URL_PREFIX)) {
			return new ClassPathResource(location.substring(CLASSPATH_URL_PREFIX.length()), getClassLoader());
		}
		else {
			try {
				// 处理 http、https、ftp、file、jar
				URL url = new URL(location);
				return (ResourceUtils.isFileURL(url) ? new FileUrlResource(url) : new UrlResource(url));
			}
			catch (MalformedURLException ex) {
				// 未知协议的，都使用ClassPathContextResource来加载
				return getResourceByPath(location);
			}
		}
	}
```

## 2.4 Classpath 匹配模式

- `classpath*:` 匹配模式,从当前项目文件中和依赖的jar包中进行查询

**匹配实现类**:PathMatchingResourcePatternResolver


### 2.4.1 classpath路径

![](https://img.springlearn.cn/blog/0475f04822095f45cdaf02dacc2c6a44.png)

使用classpath获取文件,默认就是从编译后的classes目录中获取

- 获取a.txt  `classpath:a.txt` or `this.getClass().getClassLoader().getResource("a.txt")`
- 获取b.txt  `classpath:temp/b.txt` or `this.getClass().getClassLoader().getResource("temp/b.txt")`

注意当你发现源文件中有你要的文件,但是编译后的文件中没有了,如果是在开发环境,建议 `mvn clean` 后重新编译。(这种情况一般是idea缓存问题)

如果是在上线后发现没有,可能就是maven配置的问题,项目打包的时候没有把文件给打包进去。此时可能就要添加下面的配置。

```xml
<build>
	<plugins>
		<plugin>
			<artifactId>maven-resources-plugin</artifactId>
			<version>${last_version}</version>
			<configuration>
				<encoding>UTF-8</encoding>
			</configuration>
		</plugin>
	</plugins>
</build>
```

注意如果你的文件是放在resource中,一般是不会出现这种问题的,因为Maven会从项目的src/main/resources目录下查找资源。如果你的资源不在此目录下，可以用 `<resources>` 标签指定，同时也支持多个目录。

```xml
<build>
	<resources>
		<resource>
			<directory>src/main/resources1</directory>
		</resource>
		<resource>
			<directory>src/main/resources2</directory>
		</resource>
	</resources>
</build>  
```

### 2.4.2 匹配模式

我们这里使用匹配模式 `classpath*:*.txt`, 获取txt结尾的文件

![](https://img.springlearn.cn/blog/0dc1294f41a73ae2963948257359ec37.png)


```java
    @Test
    public void test() throws Exception {
        AnnotationConfigApplicationContext cxt = new AnnotationConfigApplicationContext();
        Resource[] resources = cxt.getResources("classpath*:*.txt");
        for (Resource resource : resources) {
            System.out.println(resource.getDescription());
        }
    }
```

可以看到这里不仅把我们要的文件给查询到了,还把其他依赖的包中后缀.txt的文件给查询出来了。

```
file [/Users/liuxin/Github/learn-example/learn-spring/target/classes/a.txt]
URL [jar:file:/Users/liuxin/.m2/repository3/junit/junit/4.13/junit-4.13.jar!/LICENSE-junit.txt]
URL [jar:file:/Users/liuxin/.m2/repository3/org/hamcrest/hamcrest-core/2.2/hamcrest-core-2.2.jar!/hamcrest-core-is-deprecated.txt]
URL [jar:file:/Users/liuxin/.m2/repository3/org/projectlombok/lombok/1.18.22/lombok-1.18.22.jar!/changelog.txt]
URL [jar:file:/Users/liuxin/.m2/repository3/org/projectlombok/lombok/1.18.22/lombok-1.18.22.jar!/release-timestamp.txt]
```



![](https://img.springlearn.cn/learn_aecfc8e243edb199c726728413b1522c.gif)

**最后,都看到这里了,最后如果这篇文章,对你有所帮助,请点个关注,交个朋友。**

![](https://img-blog.csdnimg.cn/img_convert/9e7a3d6be0b037aa72c573cb91fa2e30.png)




