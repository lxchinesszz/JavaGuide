window.onload = function () {
    themeDefaultContent = $(
        '.page'
    );
    // https://readmore.openwrite.cn/user/blog2weixin/list
    themeDefaultContent.eq(0).attr('id', 'container2');
    btw = new BTWPlugin(); // 注意btw需要是个全局变量,把const去掉
    btw.init({
        id: 'container2',
        blogId: '16803-1575895588292-920',
        name: '程序猿升级课',
        qrcode: 'https://img.springlearn.cn/weixin.jpg',
        keyword: '更多',
    });
};
