router.get('/', (req, res) => {
    res.render('view/template_login', {
        page: '../index'
    });
});