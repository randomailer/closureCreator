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
    -t генерировать дополнительно ojster шаблон
    -e неймспес класса, от котого будет наследоваться сгенерированный (по умолчанию goog.ui.Component)

    -> myclass.js
    -> tempates/myclass.js