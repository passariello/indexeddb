require('proof')(2, async okay => {
    await require('./harness')(okay, 'idbfactory_open7')
    await harness(async function () {
        var open_rq = createdb(async_test(), undefined, 13);
        var did_upgrade = false;
        var open_rq2;

        open_rq.onupgradeneeded = function() {};
        open_rq.onsuccess = function(e) {
            var db = e.target.result;
            db.close();

            open_rq2 = window.indexedDB.open(db.name, 14);
            open_rq2.onupgradeneeded = function() {
                did_upgrade = true;
            };
            open_rq2.onsuccess = this.step_func(open_current_db);
            open_rq2.onerror = fail(this, 'Unexpected error')
        }

        function open_current_db(e) {
            var open_rq3 = window.indexedDB.open(e.target.result.name);
            open_rq3.onsuccess = this.step_func(function(e) {
                assert_equals(e.target.result.version, 14, "db.version")
                open_rq2.result.close();
                open_rq3.result.close();
                this.done();
            });
            open_rq3.onupgradeneeded = fail(this, 'Unexpected upgradeneeded')
            open_rq3.onerror = fail(this, 'Unexpected error')

            assert_true(did_upgrade, 'did upgrade');
        }
    })
})
