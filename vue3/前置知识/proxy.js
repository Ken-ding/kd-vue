//基础例子
const origin = { a: 10 };
var obj = new Proxy(origin, {
	get: function (target, propKey, receiver) {
		console.log(`getting ${propKey}!`);
		return Reflect.get(target, propKey, receiver);
	},
	set: function (target, propKey, value, receiver) {
		console.log(`setting ${propKey}!`);
		return Reflect.set(target, propKey, value, receiver);
	}
});

console.log(obj.a);
console.log(origin.a);

//handler.get
const person = {
	like: 'vuejs1'
};

const obj1 = new Proxy(person, {
	get: function (target, propKey) {
		if (propKey in target) {
			return target[propKey];
		} else {
			throw new ReferenceError('Prop name "' + propKey + '" does not exist.');
		}
	}
});

try {
	console.log(obj1.like);
	console.log(obj1.test);
} catch (error) {}

//注意例子
const obj2 = {};
Object.defineProperty(obj2, 'a', {
	configurable: false,
	enumerable: false,
	value: 10,
	writable: false
});

const p = new Proxy(obj2, {
	get: function (target, prop) {
		return 20;
	}
});

try {
	console.log(p.a);
} catch (error) {}

//可撤销的Proxy
const obj3 = { name: 'vuejs3' };
const { proxy, revoke } = Proxy.revocable(obj3, {
	get: function (target, propKey) {
		if (propKey in target) {
			return target[propKey];
		} else {
			throw new ReferenceError('Prop name "' + propKey + '" does not exist.');
		}
	}
});
console.log(obj3.name);
revoke();
console.log(obj3.name);

//set
let validator = {
	set: function (target, propKey, value, receiver) {
		if (prop === 'age') {
			if (!Number.isInteger(value)) {
				throw new TypeError('The age is not an integer');
			}
			if (value > 200) {
				throw new RangeError('The age seems invalid');
			}
		}
		Reflect.set(target, propKey, value, receiver);
	}
};

let obj4 = new Proxy({}, validator);
// person.age = 100;
// person.age = 'young';
// person.age = 300;

//apply
let target = function () {
	return 'I am the target';
};
let handler = {
	apply: function (target, ctx, args) {
		console.log(ctx);
		return 'I am the proxy';
	}
};
let obj5 = new Proxy(target, handler);
console.log(obj5());

//has
let handler6 = {
	has(target, key) {
		if (key[0] === '_') {
			return false;
		}
		return key in target;
	}
};
let target6 = { _prop: 'foo', prop: 'foo' };
let obj6 = new Proxy(target, handler6);
console.log('_prop' in obj6);

//construct
let obj7 = new Proxy(function () {}, {
	construct: function (target, args) {
		console.log('called: ' + args.join(', '));
		return { value: args[0] * 10 };
	}
});
console.log(new obj7(1).value);

//deleteProperty
