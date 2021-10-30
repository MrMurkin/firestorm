import pika
import time

class mq():

    def __init__(self, process_name='default_process', ip='192.168.1.10', ex_name='lenta_1'):
        '''
        # Класс работы с RabbitMQ (Трансмаш)

        Входные данные:

        process_name - имя процесса, от имени которого будут отправлятся сообщения
        ip - ip addr (192.168.1.10) or net name ('ai-rabbit')
        ex_name - имя обменника ("lenta")
        '''
        self.ip = ip
        self.ex_name = ex_name
        self.process_name = process_name
        while True:
            try:
                self.connect()
                break
            except:
                print("Ошибка подключения к Rabbit. Connect. Пауза 60 сек...")
                time.sleep(60)
        self.send(
            key='log.info',
            message=f'Start client RabbitMQ "{self.process_name}". (Exchange = "{self.ex_name}")'
        )

    def connect(self):
        credentials = pika.PlainCredentials('prog', '0011')
        params = pika.ConnectionParameters(host=self.ip, credentials=credentials, heartbeat=600, blocked_connection_timeout=300)
        connection = pika.BlockingConnection(params)
        self.channel = connection.channel()
        # Объявляем обменник
        self.channel.exchange_declare(
            exchange=self.ex_name, exchange_type='topic')


    def send(self, key='data', message=''):
        '''
        Отправляет сообщения
        message - тело сообщения
        Строковые части топика (ключа) сообщения:
        process_name = calc | analizator | neuro | admin | web-server | web-client
        type   = data | log | status | time | control
        name   = info | error | warning | ...
        '''
        routing_key = f'{self.process_name}.{key}'
        try:
            self.channel.basic_publish(
                exchange=self.ex_name, routing_key=routing_key, body=message)
        except:
            self.connect()
            self.channel.basic_publish(
                exchange=self.ex_name, routing_key=routing_key, body=message)

    def consume(self, func, bindings=['admin.control.default_process']):
        '''
        Получает сообщения и вызывает внешнюю функцию

        func(body, args) - функция, определена пользователем
            body - получаемое сообщение
            agrs = [arg1, arg2, arg3, ...]

        bindings - строка из трех частей ("process_name.type.name")
        process_name - Источник (calc | analizator | neuro | admin | web-server | web-client)
        type - Тип (data | log | status | time | control)
        name - Дополнительное поле, в основном для типа "log" (info | error | warning | ...)
            или для имеми процесса "admin" указываем имя процесса ПОЛУЧАТЕЛЯ (calc | analizator | neuro | web-server | web-client)
            "*" (звездочка) может заменять ровно одно слово.
            "#" (хеш) может заменять ноль или более слов.
        '''
        
        self.bindings = bindings
        # Объявляем экслюзивну. очередь
        id = self.channel.queue_declare(queue='', exclusive=True)
        self.qu_name = id.method.queue
        # Создаем подписки очереди на сообщения
        for binding in self.bindings:
            self.channel.queue_bind(exchange=self.ex_name,
                                    queue=self.qu_name,
                                    routing_key=binding)

        self.send(
            key='log.info',
            message=f'Start consume "{self.process_name}". (Exchange = "{self.ex_name}", queue name = "{self.qu_name}")'
        )
        self.func = func

        self.channel.basic_consume(
            queue=self.qu_name, on_message_callback=self.callback, auto_ack=True)
        while True:
            try:
                self.channel.start_consuming()
                break
            except:
                print("Ошибка подключения к Rabbit. Consuming. Пауза 60 сек...")
                time.sleep(60)        

    def callback(self, ch, method, properties, body):
        r_key = method.routing_key.split('.')
        self.func(r_key, body)