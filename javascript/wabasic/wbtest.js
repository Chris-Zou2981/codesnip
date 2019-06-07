var grammar = $.ajax({ type: "GET", url: './wb.pegjs', async: false }).responseText;
var parser = peg.generate(grammar);

// 临时存储打印的数据
var printData = [];
// 拦截 println 函数，捕获打印的数据
function println(d) {
    printData.push(d);
    console.log(d);
}

QUnit.module("Parse Test", {
    beforeEach: function() { printData = []; },
});


QUnit.test('加减法', function(assert) {
    var input = 'print 1 + 2 + 3 - 2';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([4], printData);
});

QUnit.test('加减乘除', function(assert) {
    var input = 'print 1 + 2 * 3';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([7], printData);
});

QUnit.test('带括号加减乘除', function(assert) {
    var input = 'print (1 + 2) * 3';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([9], printData);
});

QUnit.test('关系运算符', function(assert) {
    var input = 'print 1 < 0\n' +
        'print 1 < 2\n' +
        'print 1 <= 1\n' +
        'print 1 <= 2\n' +
        'print 1 <= 0\n' +
        'print 1 > 0\n' +
        'print 1 > 2\n' +
        'print 1 >= 1\n' +
        'print 1 >= 2\n' +
        'print 1 >= 0\n' +
        'print 1 == 1\n' +
        'print 1 == 2\n' +
        'print 1 != 1\n' +
        'print 1 != 2\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([false, true, true, true, false, true, false, true, false, true, true, false, false, true], printData);
});

QUnit.test('与运算符', function(assert) {
    var input = 'print 2 > 1 and 3 > 2';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([true], printData);
});

QUnit.test('关系运算符和逻辑运算符混合运算：> and >', function(assert) {
    var input = 'print 2 > 1 + 1 and 3 > 2';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([false], printData);
});

QUnit.test('关系运算符和逻辑运算符混合运算：> + and > or >', function(assert) {
    var input = 'print 2 > 1 + 1 and 3 > 2 or 1 > 0';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([true], printData);
});

QUnit.test('关系运算符和逻辑运算符混合运算：> or > + and >', function(assert) {
    var input = 'print 1 > 0 or 2 > 1 + 1 and 3 > 2';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([true], printData);
});

QUnit.test("赋值语句", function(assert) {
    var input = 'a = 1 + 2\n' +
        '    print a\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([3], printData);
});

QUnit.test("分支语句：if", function(assert) {
    var input = 'if 1 > 2 then\n' +
        '    print 1\n' +
        'end\n' +
        'if 2 > 1 then\n' +
        '    print 2\n' +
        'end\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([2], printData);
});

QUnit.test("循环语句：while", function(assert) {
    var input = 'a = 1\n' +
        'while a < 10 then\n' +
        '  if a % 2 == 0 then\n' +
        '    print a\n' +
        '  end\n' +
        '  a = a + 1\n' +
        'end\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([2, 4, 6, 8], printData);
});

QUnit.test("无参数函数定义及调用：foo()", function(assert) {
    var input = 'def foo()\n' +
        '  print 1 + 1\n' +
        'end\n' +
        'foo()\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([2], printData);
});


QUnit.test("两个参数的函数定义与调用:add(a, b)", function(assert) {
    var input = 'def add(a, b)\n' +
        '  print a + b\n' +
        'end\n' +
        'add(1, 2)\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual([3], printData);
});


QUnit.test("包含分支语句的函数定义与调用:showmax(a, b)", function(assert) {
    var input = 'def showmax(a, b)\n' +
        '  if a > b then\n' +
        '    print a\n' +
        '  end\n' +
        '  if b > a then\n' +
        '    print b\n' +
        '  end\n' +        
        'end\n' +
        'showmax(1 + 2, 2 + 2)\n';
    var ast = parser.parse(input);
    console.log(ast);
    assert.equal(ast.body.type, 'SeqStat');
    assert.equal(ast.body.body[0].type, 'def');
    assert.equal(ast.body.body[1].type, 'call');

    ast.eval();
    assert.deepEqual([4], printData);
});

QUnit.test("包含 Return 语句函数：max(a, b)", function(assert) {
    var input = 'def max(a, b)\n' +
        '  if a > b then\n' +
        '    return a\n' +
        '  end\n'+
        '  return b\n'+
        'end\n' +
        'print max(1, 2)\n' +
        'print max(4, 3)\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual(printData, [2, 4]);
});


QUnit.test("函数表达式: add(1, add(1, 2))", function(assert) {
    var input = 'def add(a, b)\n' +
        '  return a + b\n' +
        'end\n' +
        'print add(1, add(1, 2))\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual(printData, [4]);
});

QUnit.test("递归调用:printn(n)", function(assert) {
    var input = 'def printn(n)\n' +
        '  if n > 1 then\n'+
        '    printn(n - 1)\n'+
        '  end\n'+
        '  print n\n'+
        'end\n' +
        'printn(5)\n';
    var ast = parser.parse(input);
    console.log(ast);

    ast.eval();
    assert.deepEqual(printData, [1, 2, 3, 4, 5]);
});