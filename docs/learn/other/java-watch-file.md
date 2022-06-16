---
breadcrumb: false
navbar: true
sidebar: false
pageInfo: true
contributor: true
editLink: true
updateTime: true
prev: true
next: true
comment: false
footer: true
backtotop: true
title: Get新技能,Java实现文件监控
---

**作者: 八阿哥的剑**

*博客: https://springlearn.cn*

::: tip 一日一句毒鸡汤
问世间钱为何物，只叫人生死相许。！😄
:::


## Java原生版本监控

```java
public class JavaWatchAPI {

    public static void main(String[] args) throws Exception {
        //第一步：取得WatchService
        WatchService watchService = FileSystems.getDefault().newWatchService();
        //第二步：确定要监控的路径
        Path path = Paths.get("/Users/liuxin/Github/nobug-learn-project/nobug-learn-01/src/main/java");

        //第三步：为本路径绑定WatchService，并确定监控的事件
        path.register(
                watchService,
                // StandardWatchEventKinds.ENTRY_CREATE—当有新文件时触发。可能是创建了一个新文件
                StandardWatchEventKinds.ENTRY_CREATE,
                // StandardWatchEventKinds.ENTRY_DELETE—当文件被删除、移动或重命名时触发
                StandardWatchEventKinds.ENTRY_DELETE,
                // StandardWatchEventKinds.ENTRY_MODIFY—当文件被修改时触发。
                StandardWatchEventKinds.ENTRY_MODIFY);
        // StandardWatchEventKinds.OVERFLOW—触发表示丢失或丢弃的事件。
        WatchKey key = null;
        while ((key = watchService.take()) != null) {
            for (WatchEvent<?> event : key.pollEvents()) {
                System.out.println("事件" + event.kind() + "发生了，文件是：" + event.context());
            }
            key.reset();
        }
    }
}

```


## Common IO 工具包监控


```java
package cn.github.chinesszz;

import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.monitor.FileAlterationListener;
import org.apache.commons.io.monitor.FileAlterationMonitor;
import org.apache.commons.io.monitor.FileAlterationObserver;
import org.junit.Test;

import java.io.File;
import java.util.concurrent.TimeUnit;

/**
 * @author liuxin
 * 2021/11/9 8:55 下午
 */
public class CommonIOAPI {

    public static void main(String[] args) throws Exception {
        File directory = new File("/Users/liuxin/Github/nobug-learn-project/nobug-learn-01/src/main/java");
        // 轮询间隔 5 秒
        long interval = TimeUnit.SECONDS.toMillis(5);
        // 创建一个文件观察器用于处理文件的格式
        FileAlterationObserver observer = new FileAlterationObserver(directory, FileFilterUtils.and(
                FileFilterUtils.fileFileFilter(), FileFilterUtils.suffixFileFilter(".txt"),
                FileFilterUtils.prefixFileFilter("lx")));
        // 设置文件变化监听器
        observer.addListener(new MyFileListener());
        FileAlterationMonitor monitor = new FileAlterationMonitor(interval, observer);
        monitor.start();
        System.out.println(1);
    }

    @Test
    public void watchDir() throws Exception {
        File directory = new File("/Users/liuxin/Github/nobug-learn-project/nobug-learn-01/src/main/java");
        FileAlterationObserver fileAlterationObserver = new FileAlterationObserver(directory, FileFilterUtils.and(
                FileFilterUtils.directoryFileFilter()));
        long interval = TimeUnit.SECONDS.toMillis(5);
        // 设置文件变化监听器
        fileAlterationObserver.addListener(new MyFileListener());
        FileAlterationMonitor monitor = new FileAlterationMonitor(interval, fileAlterationObserver);
        monitor.start();
        while (true);
    }

    static final class MyFileListener implements FileAlterationListener {
        @Override
        public void onStart(FileAlterationObserver fileAlterationObserver) {
            System.out.println("monitor start scan files..");
        }


        @Override
        public void onDirectoryCreate(File file) {
            System.out.println(file.getName() + " director created.");
        }


        @Override
        public void onDirectoryChange(File file) {
            System.out.println(file.getName() + " director changed.");
        }


        @Override
        public void onDirectoryDelete(File file) {
            System.out.println(file.getName() + " director deleted.");
        }


        @Override
        public void onFileCreate(File file) {
            System.out.println(file.getName() + " created.");
        }


        @Override
        public void onFileChange(File file) {
            System.out.println(file.getName() + " changed.");
        }


        @Override
        public void onFileDelete(File file) {
            System.out.println(file.getName() + " deleted.");
        }


        @Override
        public void onStop(FileAlterationObserver fileAlterationObserver) {
            System.out.println("monitor stop scanning..");
        }
    }
}


```
