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
title: 第09篇:MessageSource国际化
category: Spring Framework
image: https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png
---

![](https://img.springlearn.cn/blog/b8f74de10af99991e3fc73632eeeb190.png)

**公众号**: 西魏陶渊明<br/>
**CSDN**: [https://springlearn.blog.csdn.net](https://springlearn.blog.csdn.net/?type=blog)<br/>

>天下代码一大抄, 抄来抄去有提高, 看你会抄不会抄！
![](https://img.springlearn.cn/blog/8f3392b9badb093f9e1a6472b4a98487.gif)

## 一、前言

### 1.1 i18n

12
## 二、API

### 2.1 Locale

### 2.2 文件命名规范

AcceptLanguage en_US 语言解析器

LanguageTag.parse
Locale#forLanguageTag  en_US 要转成 en-US 中划线

### LocaleResolver#resolveLocale

```java
@Override
	public Locale resolveLocale(HttpServletRequest request) {
		Locale defaultLocale = getDefaultLocale();
		if (defaultLocale != null && request.getHeader("Accept-Language") == null) {
			return defaultLocale;
		}
		Locale requestLocale = request.getLocale();
		List<Locale> supportedLocales = getSupportedLocales();
		if (supportedLocales.isEmpty() || supportedLocales.contains(requestLocale)) {
			return requestLocale;
		}
		Locale supportedLocale = findSupportedLocale(request, supportedLocales);
		if (supportedLocale != null) {
			return supportedLocale;
		}
		return (defaultLocale != null ? defaultLocale : requestLocale);
	}
```

### 2.3 Spring中体系

![](https://img.springlearn.cn/blog/770062b2a890bc4663bcbfecc7420e75.png)


- MessageSource

- HierarchicalMessageSource

- MessageSourceSupport

- AbstractMessageSource

- StaticMessageSource

- AbstractResourceBasedMessageSource

- ResourceBundleMessageSource

- ReloadableResourceBundleMessageSource

## 三、使用

### 后端渲染页面场景


### 前后端分离

### 3.1 spring实现原理

### 3.2 springboot中使用

```java
spring.mvc.locale-resolver=accept_header
spring.messages.basename=message
```
