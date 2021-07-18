require('proof')(2, async okay => {
    await require('./harness')(okay, 'idbcursor_advance_objectstore5')
    await harness(async function () {
        var db,
            t = async_test(),
            records = [{ pKey: "primaryKey_0"},
                       { pKey: "primaryKey_1"}];

        var open_rq = createdb(t);
        open_rq.onupgradeneeded = function (event) {
            db = event.target.result;
            var objStore = db.createObjectStore("store", {keyPath:"pKey"});
            for (var i = 0; i < records.length; i++) {
                objStore.add(records[i]);
            }
            var rq = objStore.openCursor();
            rq.onsuccess = t.step_func(function(event) {
                var cursor = event.target.result;
                assert_true(cursor instanceof IDBCursor, "cursor exist");

                db.deleteObjectStore("store");
                assert_throws_dom("InvalidStateError", function() {
                    cursor.advance(1);
                }, "If the cursor's source or effective object store has been deleted, the implementation MUST throw a DOMException of type InvalidStateError");

                t.done();
            });
        }
    })
})
