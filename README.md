closureCreator
==============

Генератор классов в closure library style.

### Как установить

    git clone git://github.com/randomailer/closureCreator.git
    cd closureCreator
    sudo npm link


### Пример использования

    closureCreator -c nameSpace.MyClass -t


    -c неймспейс класса
    -t генерировать дополнительно ojster шаблон (не обязательный)
    -e неймспес класса, от котого будет наследоваться сгенерированный (не обязательный, по умолчанию goog.ui.Component)
    -ot генерировать только ojster шаблон

### На выходе получится следующее

```
goog.provide('namespace.MyClass');

goog.require('namespace.myClass.templates.MyClass);
goog.require('goog.ui.Component');
goog.require('ojster');

/**
 *
 * @extends {goog.ui.Component}
 * @constructor
 */
namespace.MyClass = function () {
    goog.base(this);
};
goog.inherits(namespace.MyClass, goog.ui.Component);

namespace.MyClass.prototype.createDom = function () {
    /** @type {ojster.Template}
    var template = new namespace.myClass.templates.MyClass();
    /** @type {Element} */
    var element = ojster.createTemplate(template);
    this.setElementInternal(element);
};

namespace.MyClass.prototype.enterDocument = function () {
    goog.base(this, 'enterDocument');
};

/**
 *
 * @inheritDoc
 */
namespace.MyClass.prototype.disposeInternal = function () {
    goog.base(this, 'disposeInternal');
};
```

### Ну и набросок для темплейта

```
<% @require ojster %>

<% @template namespace.myClass.templates.MyClass %>
<% @inherits ojster.Template %>


<% @block main { %>

<% @block main } %>
```