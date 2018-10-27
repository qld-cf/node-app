'use strict';

require('should');

const mongoose = require('mongoose');
const cachegoose = require('../src');
cachegoose(mongoose);
const Schema = mongoose.Schema;

let RecordSchema;
let Record;
let cache;
let db;

describe('cachegoose', () => {
    before((done) => {
        mongoose.connect('mongodb://127.0.0.1/mongoose-cachegoose-testing');
        db = mongoose.connection;
        db.on('error', done);
        db.on('open', done);
        RecordSchema = new Schema({
            num: Number,
            str: String,
            date: {
                type: Date,
                default: Date.now
            }
        });
        Record = mongoose.model('Record', RecordSchema);
    });

    beforeEach(() => {
        return generate(10);
    });

    afterEach((done) => {
        // Record.remove(() => {
            done()
        // });
    });

    /**
     *     .cache(ttl , key, boolean)
     *     ttl:过期时间(可空，默认60*60    60min）
     *     key:Redis存储key(可空）
     *     boolean:是否需要最新的数据（可空，默认为false）
     *     .cache(3600)
     *     .cache(3600,'keyKeyKey')
     *     .cache(3600,'keyKeyKey',false)
     *     .cache('keyKeyKey',false)
     *     .cache(false)
     *     .cache(3600,false)
     */
    it('should cache a simple query that uses callbacks', (done) => {
        Record
            .find()
            // .update({},{})
            .cache()
            .then((res) => {
                console.dir('then111')
                // res.length.should.equal(10);
                done();
            })
            .catch((err) => {
                if (err) return done(err);
            });

    });
})

function generate(amount) {
  const records = [];
  let count = 0;
  while (count < amount) {
    records.push({
      num: count,
      str: count.toString()
    });
    count++;
  }

  return Record.create(records);
}
