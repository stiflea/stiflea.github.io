```
title: JUC的学习
author: caihua
```



1、什么是JUC

**源码+官方文档**

JUC是 java util concurrent

**面试高频问JUC~！**

![image-20220220214121457](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20220220214121457.png)

java.util 是Java的一个工具包~

**业务：普通的线程代码 Thread** 

**Runnable：** 没有返回值、效率相比于**Callable** 相对较低！

![image-20220220214153230](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20220220214153230.png)



## 2、线程和进程

**进程：一个程序，QQ.EXE Music.EXE；数据+代码+pcb**

一个进程可以包含多个线程，至少包含一个线程！

Java默认有几个线程？**2个线程！** main线程、GC线程

**线程：开了一个进程Typora，写字，等待几分钟会进行自动保存(线程负责的)**

对于Java而言：Thread、Runable、Callable进行开启线程的，我们之前。

**==提问？JAVA真的可以开启线程吗？ 开不了的！==**

```java
    public synchronized void start() {
        /**
         * This method is not invoked for the main method thread or "system"
         * group threads created/set up by the VM. Any new functionality added
         * to this method in the future may have to also be added to the VM.
         *
         * A zero status value corresponds to state "NEW".
         */
        if (threadStatus != 0)
            throw new IllegalThreadStateException();

        /* Notify the group that this thread is about to be started
         * so that it can be added to the group's list of threads
         * and the group's unstarted count can be decremented. */
        group.add(this);

        boolean started = false;
        try {
            start0();
            started = true;
        } finally {
            try {
                if (!started) {
                    group.threadStartFailed(this);
                }
            } catch (Throwable ignore) {
                /* do nothing. If start0 threw a Throwable then
                  it will be passed up the call stack */
            }
        }
    }
	//这是一个C++底层，Java是没有权限操作底层硬件的
    private native void start0();
```

Java是没有权限去开启线程、操作硬件的，这是一个native的一个本地方法，它调用的底层的C++代码。





> 并发、并行

**并发：** 多线程操作同一个资源。

- CPU 只有一核，模拟出来多条线程，天下武功，唯快不破。那么我们就可以使用CPU快速交替，来模拟多线程。

**并行：** 多个人一起行走

- CPU多核，多个线程可以同时执行。 我们可以使用线程池！

```java
public class Test1 {
    public static void main(String[] args) {
        //获取cpu的核数
        System.out.println(Runtime.getRuntime().availableProcessors());
    }
}
```

并发编程的本质：**充分利用CPU的资源！**



> 线程有几个状态？

线程的状态：6个状态

```java
public enum State {
        /**
         * Thread state for a thread which has not yet started.
         */
    	//运行
        NEW,

        /**
         * Thread state for a runnable thread.  A thread in the runnable
         * state is executing in the Java virtual machine but it may
         * be waiting for other resources from the operating system
         * such as processor.
         */
    	//运行
        RUNNABLE,

        /**
         * Thread state for a thread blocked waiting for a monitor lock.
         * A thread in the blocked state is waiting for a monitor lock
         * to enter a synchronized block/method or
         * reenter a synchronized block/method after calling
         * {@link Object#wait() Object.wait}.
         */
    	//阻塞
        BLOCKED,

        /**
         * Thread state for a waiting thread.
         * A thread is in the waiting state due to calling one of the
         * following methods:
         * \<ul>
         *   \<li>{@link Object#wait() Object.wait} with no timeout\</li>
         *   \<li>{@link #join() Thread.join} with no timeout\</li>
         *   \<li>{@link LockSupport#park() LockSupport.park}\</li>
         * \</ul>
         *
         * \<p>A thread in the waiting state is waiting for another thread to
         * perform a particular action.
         *
         * For example, a thread that has called \<tt>Object.wait()\</tt>
         * on an object is waiting for another thread to call
         * \<tt>Object.notify()\</tt> or \<tt>Object.notifyAll()\</tt> on
         * that object. A thread that has called \<tt>Thread.join()\</tt>
         * is waiting for a specified thread to terminate.
         */
    	//等待
        WAITING,

        /**
         * Thread state for a waiting thread with a specified waiting time.
         * A thread is in the timed waiting state due to calling one of
         * the following methods with a specified positive waiting time:
         * \<ul>
         *   \<li>{@link #sleep Thread.sleep}\</li>
         *   \<li>{@link Object#wait(long) Object.wait} with timeout\</li>
         *   \<li>{@link #join(long) Thread.join} with timeout\</li>
         *   \<li>{@link LockSupport#parkNanos LockSupport.parkNanos}\</li>
         *   \<li>{@link LockSupport#parkUntil LockSupport.parkUntil}\</li>
         * \</ul>
         */
    	//超时等待
        TIMED_WAITING,

        /**
         * Thread state for a terminated thread.
         * The thread has completed execution.
         */
    	//终止
        TERMINATED;
    }
```



> wait/sleep的区别

**1、来自不同的类**

wait => Object

sleep => Thread

一般情况企业中使用休眠是：

```java
TimeUnit.DAYS.sleep(1); //休眠1天
TimeUnit.SECONDS.sleep(1); //休眠1s
```

**2、关于锁的释放**

wait 会释放锁；

sleep睡觉了，不会释放锁；

**3、使用的范围是不同的**

wait 必须在同步代码块中；

sleep 可以在任何地方睡；

**4、是否需要捕获异常**

wait是不需要捕获异常；

sleep必须要捕获异常；



## 3、Lock锁（重点）

> 传统的Synchronized

```java
/**
 * 真正的多线程开发
 * 线程就是一个单独的资源类，没有任何的附属操作！
 */
public class SaleTicketDemo01 {
    public static void main(String[] args) {
        //多线程操作
        //并发：多线程操作同一个资源类，把资源类丢入线程
        Ticket ticket = new Ticket();

        //@FunctionalInterface 函数式接口 jdk1.8之后 lambda表达式
        new Thread(()->{
            for(int i=0;i\<40;i++){
                ticket.sale();
            }
        },"A").start();
        new Thread(()->{
            for(int i=0;i\<40;i++){
                ticket.sale();
            }
        },"B").start();
        new Thread(()->{
            for(int i=0;i\<40;i++){
                ticket.sale();
            }
        },"C").start();
    }
}
//资源类
//属性+方法
//oop
class Ticket{
    private int number=50;


    //卖票的方式
    // synchronized 本质：队列，锁
    public synchronized void sale(){
        if(number>0){
            System.out.println(Thread.currentThread().getName()+" 卖出了第"+number+" 张票,剩余："+number+" 张票");
            number--;
        }
    }
}
```





> Lock接口

![image-20220220214210470](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20220220214210470.png)



![image-20200714100351018](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714100351018.png)

![image-20200714100747457](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714100747457.png)

**公平锁：** 十分公平，必须先来后到~；

**非公平锁：** 十分不公平，可以插队；**(默认为非公平锁)**

```java
public class SaleTicketDemo02 {
    public static void main(String[] args) {
        //多线程操作
        //并发：多线程操作同一个资源类，把资源类丢入线程
        Ticket2 ticket = new Ticket2();
        new Thread(()->{for(int i=0;i\<40;i++) ticket.sale(); },"A").start();
        new Thread(()->{for(int i=0;i\<40;i++) ticket.sale(); },"B").start();
        new Thread(()->{for(int i=0;i\<40;i++) ticket.sale(); },"C").start();
    }
}

//lock三部曲
//1、    Lock lock=new ReentrantLock();
//2、    lock.lock() 加锁
//3、    finally=> 解锁：lock.unlock();
class Ticket2{
    private int number=50;

    Lock lock=new ReentrantLock();

    //卖票的方式
    // 使用Lock 锁
    public void sale(){
        //加锁
        lock.lock();
        try {
            //业务代码
            if(number>=0){
                System.out.println(Thread.currentThread().getName()+" 卖出了第"+number+" 张票,剩余："+number+" 张票");
                number--;
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            //解锁
            lock.unlock();
        }
    }
}
```

> Synchronized 和 Lock区别

- 1、Synchronized 内置的Java关键字，Lock是一个Java类

- 2、Synchronized 无法判断获取锁的状态，Lock可以判断

- 3、Synchronized 会自动释放锁，lock必须要手动加锁和手动释放锁！**死锁**

- 4、Synchronized 线程1(获得锁->阻塞)、线程2(等待)；

  lock就不一定会一直等待下去，lock会有一个trylock去尝试获取锁，不会造成长久的等待。

- 5、Synchronized 是可重入锁，不可以中断的，非公平的；Lock，可重入的，可以判断锁，可以自己设置公平锁和非公平锁；
- Synchronized 适合锁少量的代码同步问题，Lock适合锁大量的同步代码；



> 锁到底是什么？ 如何判断锁的是谁？

## 4、生产者和消费者问题！

Synchronized  wait notify可以实现，该方法是传统版本；

我们这次使用lock版本

> Synchronized版本

```java
public class A {
    public static void main(String[] args) {
        Data data = new Data();

        new Thread(()->{for(int i=0;i\<10;i++) {
            try {
                data.increment();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        },"A").start();
        new Thread(()->{for(int i=0;i\<10;i++) {
            try {
                data.decrement();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }},"B").start();
    }
}
class Data{
    //数字  资源类
    private int number = 0;

    //+1
    public synchronized void increment() throws InterruptedException {
        if(number!=0){
            //等待操作
            this.wait();
        }
        number++;
        System.out.println(Thread.currentThread().getName()+"=>"+number);
        //通知其他线程 我+1完毕了
        this.notifyAll();
    }

    //-1
    public synchronized void decrement() throws InterruptedException {
        if(number==0){
            //等待操作
            this.wait();
        }
        number--;
        System.out.println(Thread.currentThread().getName()+"=>"+number);
        //通知其他线程  我-1完毕了
        this.notifyAll();
    }

}
```

> 问题存在，A线程B线程，现在如果我有四个线程A B C D！

![image-20200714115847944](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714115847944.png)

**==解决方案==**： **if 改为while即可，防止虚假唤醒**

这样就不存在问题了：

![image-20200714115948539](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714115948539.png)



> JUC版本的生产者和消费者问题

**await、signal 替换 wait、notify**  

![image-20200714121131167](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714121131167.png)

通过Lock找到Condition

![image-20200714120811305](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714120811305.png)

```java
public class B {
    public static void main(String[] args) {
        Data2 data = new Data2();

        new Thread(()->{for(int i=0;i\<10;i++) {
            data.increment();
        }
        },"A").start();
        new Thread(()->{for(int i=0;i\<10;i++) {
            data.decrement();
        }},"B").start();
        new Thread(()->{for(int i=0;i\<10;i++) {
            data.increment();
        }
        },"C").start();
        new Thread(()->{for(int i=0;i\<10;i++) {
            data.decrement();
        }
        },"D").start();
    }
}
class Data2{
    //数字  资源类
    private int number = 0;

    //lock锁
    Lock lock = new ReentrantLock();
    Condition condition = lock.newCondition();

    //+1
    public void increment()  {
        lock.lock();
        try{

            //业务
            while (number!=0){
                //等待操作
                condition.await();
            }
            number++;
            System.out.println(Thread.currentThread().getName()+"=>"+number);
            //通知其他线程 我+1完毕了
            condition.signalAll();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    //-1
    public void decrement()  {
        lock.lock();
        try{
            //业务
            while (number==0){
                //等待操作
                condition.await();
            }
            number--;
            System.out.println(Thread.currentThread().getName()+"=>"+number);
            //通知其他线程 我+1完毕了
            condition.signalAll();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

> **Condition的优势**：精准的通知和唤醒的线程！

如果我们要指定通知的下一个进行顺序怎么办呢？ 我们可以使用Condition来指定通知进程~

```
/**
 * A 执行完 调用B
 * B 执行完 调用C
 * C 执行完 调用A
 */

public class C {

    public static void main(String[] args) {
        Data3 data3 = new Data3();
        new Thread(()->{
            for(int i=0;i\<10;i++){
                data3.printA();
            }
        },"A").start();
        new Thread(()->{
            for(int i=0;i\<10;i++){
                data3.printB();
            }
        },"B").start();
        new Thread(()->{
            for(int i=0;i\<10;i++){
                data3.printC();
            }
        },"C").start();
    }
}

class Data3{
    //资源类
    private Lock lock=new ReentrantLock();
    private Condition condition1 = lock.newCondition();
    private Condition condition2 = lock.newCondition();
    private Condition condition3 = lock.newCondition();
    private int number = 1; //1A 2B 3C

    public void printA(){
        lock.lock();
        try {
            //业务 判断 -> 执行 -> 通知
            while(number!=1){
                //等待
                condition1.await();
            }
            //操作
            System.out.println(Thread.currentThread().getName()+",AAAAA");
            //唤醒指定的线程
            number=2;
            condition2.signal(); // 唤醒2

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    public void printB(){
        lock.lock();
        try {
            //业务 判断 -> 执行 -> 通知
            while (number!=2){
                condition2.await();
            }
            System.out.println(Thread.currentThread().getName()+",BBBBB");
            //唤醒3
            number=3;
            condition3.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    public void printC(){
        lock.lock();
        try {
            //业务 判断 -> 执行 -> 通知
            while(number!=3){
                condition3.await();
            }
            System.out.println(Thread.currentThread().getName()+",CCCCC");
            //唤醒1
            number=1;
            condition1.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

![image-20200714140901384](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714140901384.png)



## 5、8锁现象

如何判断锁的是谁！锁到底锁的是谁？

锁会锁住：对象、Class

**深刻理解我们的锁**

- 问题1：

![image-20200714143058116](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714143058116.png)

结果是：先发短信，如何再打电话！

**为什么？ 如果你认为是顺序在前？ 这个答案是错误的！**

- 问题2：

我们再来看：我们让发短信 延迟4s

![image-20200714143443580](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714143443580.png)

现在结果是什么呢？

结果：**还是先发短信，然后再打电话！**

**why？**

#### ==原因：并不是顺序执行！是因为synchronized 锁的对象是方法的调用！对于两个方法用的是同一个锁，谁先拿到谁先执行！另外一个则等待！==

- 问题3：

如果我们添加一个普通方法，那么先执行哪一个呢？

![image-20200714144526071](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714144526071.png)

答案是：**先执行hello，然后再执行发短信！**原因是hello是一个**普通方法**，**不受synchronized锁的影响**，但是我发现，如果我把发短信里面的延迟4秒去掉，那么就会顺序执行，先执行发短信然后再执行hello，原因应该是顺序执行的原因吧。





- 问题4：

如果我们使用的是两个对象，一个调用发短信，一个调用打电话，那么整个顺序是怎么样的呢？

![image-20200714145849939](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714145849939.png)

答案是：先打电话，后发短信。原因：**在发短信方法中延迟了4s，又因为synchronized锁的是对象，但是我们这使用的是两个对象，所以每个对象都有一把锁，所以不会造成锁的等待。正常执行**

- 问题5，6：

如果我们把synchronized的方法加上static变成静态方法！那么顺序又是怎么样的呢？

（1）我们先来使用一个对象调用两个方法！

答案是：**先发短信,后打电话** 因为用的是同一把锁

（2）如果我们使用两个对象调用两个方法！

答案是：**还是先发短信，后打电话** 还是同一把锁

原因是什么呢？ 为什么加了static就始终前面一个对象先执行呢！为什么后面会等待呢？

原因是：**对于static静态方法来说，对于整个类Class来说只有一份，不同的对象使用的是同一份方法，相当于这个方法是属于这个类的，如果静态static方法使用synchronized锁定，那么这个synchronized锁会锁住整个Class！不管多少个对象，对于静态的锁都只有一把锁，谁先拿到这个锁就先执行，其他的进程都需要等待！**

- 问题7：

如果我们使用一个静态同步方法、一个同步方法、一个对象调用顺序是什么？

![image-20200714151657067](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714151657067.png)

明显答案是：先打电话，后发短信了。

**因为一个锁的是Class类模板，一个锁的是对象调用者。所有后面那个打电话不需要等待发短信，直接运行就可以了。**

- 问题8：

如果我们使用一个静态同步方法、一个同步方法、两个对象调用顺序是什么呢？

![image-20200714152050572](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714152050572.png)

当然答案是：先打电话、后发短信！

因为两个对象，一样的原因：**两把锁锁的不是同一个东西，所以后面的第二个对象不需要等待第一个对象的执行。**



> 小结

**new** 出来的 this 是具体的一个对象

**static Class** 是唯一的一个模板



## 6、集合类不安全

> List不安全



我们来看一下List这个集合类：

```java
//java.util.ConcurrentModificationException 并发修改异常！
public class ListTest {
    public static void main(String[] args) {

        List\<Object> arrayList = new ArrayList\\<>();

        for(int i=1;i\<=10;i++){
            new Thread(()->{
                arrayList.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(arrayList);
            },String.valueOf(i)).start();
        }

    }
}
```

会造成：

![image-20200714223050294](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714223050294.png)

**ArrayList 在并发情况下是不安全的！**

解决方案：

**1、切换成Vector就是线程安全的啦！**

![image-20200714223347796](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714223347796.png)

 **2、使用Collections.synchronizedList(new ArrayList\\<>());**

```java
public class ListTest {
    public static void main(String[] args) {

        List\<Object> arrayList = Collections.synchronizedList(new ArrayList\\<>());

        for(int i=1;i\<=10;i++){
            new Thread(()->{
                arrayList.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(arrayList);
            },String.valueOf(i)).start();
        }

    }
}
```

**3、使用JUC中的包：List\<Object> arrayList = new CopyOnWriteArrayList\\<>();**

```java
public class ListTest {
    public static void main(String[] args) {

        List\<Object> arrayList = new CopyOnWriteArrayList\\<>();

        for(int i=1;i\<=10;i++){
            new Thread(()->{
                arrayList.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(arrayList);
            },String.valueOf(i)).start();
        }

    }
}
```

**CopyOnWriteArrayList**：写入时复制！	COW	计算机程序设计领域的一种优化策略

多个线程调用的时候，list，读取的时候，固定的，写入（存在覆盖操作）；在写入的时候避免覆盖，造成数据错乱的问题；





> **CopyOnWriteArrayList**比**Vector**厉害在哪里？

**Vector**底层是使用**synchronized**关键字来实现的：效率特别低下。

![image-20200714225024395](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714225024395.png)

**CopyOnWriteArrayList**使用的是Lock锁，效率会更加高效！

![image-20200714225135841](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200714225135841.png)



> Set不安全

![image-20200715123708481](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715123708481.png)

和List、Set同级的还有一个BlockingQueue 阻塞队列；

**Set和List同理可得:** 多线程情况下，普通的Set集合是线程不安全的；

解决方案还是两种：

- 使用Collections工具类的**synchronized**包装的Set类
- 使用CopyOnWriteArraySet 写入复制的**JUC**解决方案

**CopyOnWriteArraySet** 底层是维护了一个**CopyOnWriteArrayList** 这么一个集合。在set.add的时候，调用的是copyOnWriteArrayList的addIfAbsent方法，底层也是使用lock锁进行同步的。

```java
private boolean addIfAbsent(E e, Object[] snapshot) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            Object[] current = getArray();
            int len = current.length;
            if (snapshot != current) {
                // Optimize for lost race to another addXXX operation
                int common = Math.min(snapshot.length, len);
                for (int i = 0; i \< common; i++)
                    if (current[i] != snapshot[i] && eq(e, current[i]))
                        return false;
                if (indexOf(e, current, common, len) >= 0)
                        return false;
            }
            Object[] newElements = Arrays.copyOf(current, len + 1);
            newElements[len] = e;
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }
```



```java
//同理：java.util.ConcurrentModificationException
// 解决方案：
public class SetTest {
    public static void main(String[] args) {
//        Set\<String> hashSet = Collections.synchronizedSet(new HashSet\\<>()); //解决方案1
        Set\<String> hashSet = new CopyOnWriteArraySet\\<>();//解决方案2
        for (int i = 1; i \< 100; i++) {
            new Thread(()->{
                hashSet.add(UUID.randomUUID().toString().substring(0,5));
                System.out.println(hashSet);
            },String.valueOf(i)).start();
        }
    }
}
```

#### HashSet底层是什么？

hashSet底层就是一个**HashMap**；

```java
public HashSet() {
        map = new HashMap\\<>();
}

//add 本质其实就是一个map的key，map的key是无法重复的，所以使用的就是map存储
//hashSet就是使用了hashmap key不能重复的原理
public boolean add(E e) {
        return map.put(e, PRESENT)==null;
}
//PRESENT是什么？ 是一个常量  不会改变的常量  无用的占位
//以add的value作为key，然后用一个object作为占位符 存入到map中，因为map的key是不能重复的，所以set的不可
//重复机制就是这样实现的

private static final Object PRESENT = new Object();
```



> Map不安全

回顾map的基本操作：

```
//map 是这样用的吗？  不是，工作中不使用这个
//默认等价什么？ new HashMap\\<>(16,0.75);
Map\<String, String> map = new HashMap\\<>();
//加载因子、初始化容量
```

默认加载因子是0.75,默认的初始容量是16

![image-20200715125929812](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715125929812.png)

同样的HashMap基础类也存在**并发修改异常**！

```java
public static void main(String[] args) {
        //map 是这样用的吗？  不是，工作中不使用这个
        //默认等价什么？ new HashMap\\<>(16,0.75);
        Map\<String, String> map = new HashMap\\<>();
        //加载因子、初始化容量
        for (int i = 1; i \< 100; i++) {
            new Thread(()->{
                map.put(Thread.currentThread().getName(),UUID.randomUUID().toString().substring(0,5));
                System.out.println(map);
            },String.valueOf(i)).start();
        }
    }
```

结果同样的出现了：**异常java.util.ConcurrentModificationException 并发修改异常**

**解决方案：**

- **使用Collections.synchronizedMap(new HashMap\\<>());处理**；
-  **使用ConcurrentHashMap进行并发处理**

#### TODO:研究ConcurrentHashMap底层原理：

我们来看一下ConcurrentHashMap的底层源码：

在jdk1.8之前，concurrentHashMap使用的分段锁进行同步代码机制的实现。

在jdk1.8之后，抛弃了Segment分段式机制，利用了CAS+synchronized来保证并发更新安全；

数据结构使用：数组+链表+红黑树。

**源码：**

#### 初始值：  初始的容量16、加载因子是0.75，当实际容量大于16*0.75的时候进行扩容。

```java
    private static final int DEFAULT_CAPACITY = 16;

    /**
     * The largest possible (non-power of two) array size.
     * Needed by toArray and related methods.
     */
    static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

    /**
     * The default concurrency level for this table. Unused but
     * defined for compatibility with previous versions of this class.
     */
    private static final int DEFAULT_CONCURRENCY_LEVEL = 16;

    /**
     * The load factor for this table. Overrides of this value in
     * constructors affect only the initial table capacity.  The
     * actual floating point value isn't normally used -- it is
     * simpler to use expressions such as {@code n - (n >>> 2)} for
     * the associated resizing threshold.
     */
    private static final float LOAD_FACTOR = 0.75f;

```

#### put操作

```java
final V putVal(K key, V value, boolean onlyIfAbsent) {
        /**
         *  concurrentHashMap 底层在jdk1.8之后 使用的数据结构：数组 + 链表 +红黑树
         *  使用CAS + synchronized 保证线程同步
         */
        if (key == null || value == null) throw new NullPointerException();
        int hash = spread(key.hashCode());
        int binCount = 0;
        for (Node\<K,V>[] tab = table;;) {
            Node\<K,V> f; int n, i, fh;
            if (tab == null || (n = tab.length) == 0)  //判断是否未初始化，如果没有初始化 则进行初始化
                tab = initTable();
            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {  //初始化完毕后  循环回来  i=(n-1)&hash 为索引值 查找这个元素，
                //如果这个值为null  那么就是插入这个值 使用 CAS 进行插入
                if (casTabAt(tab, i, null,
                             new Node\<K,V>(hash, key, value, null)))  //进行add操作，使用CAS 保证线程同步安全
                    break;                   // no lock when adding to empty bin
                	//插入成功后 直接break 跳出循环， 然后使用count查看是否需要扩容
            }
            else if ((fh = f.hash) == MOVED)  //表示正在扩容
                tab = helpTransfer(tab, f);
            else {
                V oldVal = null;
                synchronized (f) {  //对于其他的一些情况 只能进行加重量级锁同步
                    if (tabAt(tab, i) == f) { //查看值是否被修改了  没有被修改 才继续插入
                        if (fh >= 0) {
                            binCount = 1; //记录当前的节点数目
                            for (Node\<K,V> e = f;; ++binCount) { 
                                K ek;
                                if (e.hash == hash &&
                                    ((ek = e.key) == key ||
                                     (ek != null && key.equals(ek)))) {
                                    oldVal = e.val;
                                    if (!onlyIfAbsent)
                                        e.val = value;
                                    break;
                                }
                                Node\<K,V> pred = e;
                                if ((e = e.next) == null) {
                                    pred.next = new Node\<K,V>(hash, key,
                                                              value, null); //链表插入
                                    break;
                                }
                            }
                        }
                        else if (f instanceof TreeBin) {
                            Node\<K,V> p;
                            binCount = 2;
                            if ((p = ((TreeBin\<K,V>)f).putTreeVal(hash, key,
                                                           value)) != null) {
                                oldVal = p.val;
                                if (!onlyIfAbsent)
                                    p.val = value;
                            }
                        }
                    }
                }
                if (binCount != 0) {
                    if (binCount >= TREEIFY_THRESHOLD) //和hashmap 是一样的，如果链表长度 大于等于8  就转化为红黑树
                        treeifyBin(tab, i);
                    if (oldVal != null)
                        return oldVal;
                    break;
                }
            }
        }
        addCount(1L, binCount);
        return null;
    }

/**
     * 保证拿到最新的数据
     * @param tab
     * @param i
     * @param \<K>
     * @param \<V>
     * @return
     */
    @SuppressWarnings("unchecked")
    static final \<K,V> Node\<K,V> tabAt(Node\<K,V>[] tab, int i) {
        return (Node\<K,V>)U.getObjectVolatile(tab, ((long)i \<\< ASHIFT) + ABASE);
    }

/**
     * 后面再set值，比较数组tab[i]的值是否为c；
     * 如果和c相等，那么就用v交换
     * 如果不和c相等，相当于被其他线程所修改了，不操作。
     * @param tab 数据
     * @param i 下标
     * @param c  old value
     * @param v  new value
     * @param \<K>
     * @param \<V>
     * @return
     */
    static final \<K,V> boolean casTabAt(Node\<K,V>[] tab, int i,
                                        Node\<K,V> c, Node\<K,V> v) {
        return U.compareAndSwapObject(tab, ((long)i \<\< ASHIFT) + ABASE, c, v);
    }

    /**
     * 第一次set值
     * @param tab
     * @param i
     * @param v
     * @param \<K>
     * @param \<V>
     */
    static final \<K,V> void setTabAt(Node\<K,V>[] tab, int i, Node\<K,V> v) {
        U.putObjectVolatile(tab, ((long)i \<\< ASHIFT) + ABASE, v);
    }
```

扩容操作：

- 1、构建一个nextTable，大小是当前table的两倍；
- 把table的数据复制到nextTable中：

```java
private final void addCount(long x, int check) {
        CounterCell[] as; long b, s;
        if ((as = counterCells) != null ||
            !U.compareAndSwapLong(this, BASECOUNT, b = baseCount, s = b + x)) {
            CounterCell a; long v; int m;
            boolean uncontended = true;
            if (as == null || (m = as.length - 1) \< 0 ||
                (a = as[ThreadLocalRandom.getProbe() & m]) == null ||
                !(uncontended =
                  U.compareAndSwapLong(a, CELLVALUE, v = a.value, v + x))) {
                fullAddCount(x, uncontended);
                return;
            }
            if (check \<= 1)
                return;
            s = sumCount();
        }
        if (check >= 0) {
            Node\<K,V>[] tab, nt; int n, sc;
            while (s >= (long)(sc = sizeCtl) && (tab = table) != null &&
                   (n = tab.length) \< MAXIMUM_CAPACITY) {
                int rs = resizeStamp(n);
                if (sc \< 0) {  //这种情况代表 有其他线程正在扩容
                    if ((sc >>> RESIZE_STAMP_SHIFT) != rs || sc == rs + 1 ||
                        sc == rs + MAX_RESIZERS || (nt = nextTable) == null ||
                        transferIndex \<= 0)
                        break;
                    if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1))  // 通过以上五个条件 尝试进行扩容
                        transfer(tab, nt);
                }
                //试着让自己成为第一个执行transfer任务的线程
                else if (U.compareAndSwapInt(this, SIZECTL, sc,
                                             (rs \<\< RESIZE_STAMP_SHIFT) + 2))
                    transfer(tab, null);
                s = sumCount(); // 重新计数，判断是否需要开启下一轮扩容
            }
        }
    }
```

**transfer方法：**

节点从table移动到nextTable，大体思想是遍历、复制的过程。

- 遍历过所有的节点以后就完成复制工作，把table指向nextTable；
- 更新sizeCtl为新数组大小的0.75倍 ，扩容完成。

```java
在这个方法中：
使用移位巧妙的避免了乘法和减法的出现：
sizeCtl = (n \<\< 1) - (n >>> 1); // 32 - 8  24
```



## 7、Callable(简单)

![image-20200715141444025](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715141444025.png)

1、可以有返回值；

2、可以抛出异常；

3、方法不同，run()/call()

> 代码测试

传统使用线程方式：

```java
public class CallableTest {
    public static void main(String[] args) {
        for (int i = 1; i \< 10; i++) {
            new Thread(new MyThread()).start();
        }
    }
}

class MyThread implements Runnable{

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}
```

使用**Callable**进行多线程操作：

![image-20200715143833801](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715143833801.png)

Calleable\<T> 泛型T就是call运行方法的返回值类型；

但是如何使用呢？

Callable怎么放入到Thread里面呢？

源码分析：

![image-20200715145640791](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715145640791.png)

对于Thread运行，只能传入Runnable类型的参数；

我们这是Callable 怎么办呢？

看JDK api文档：

在Runnable里面有一个叫做FutureTask的实现类，我们进去看一下。

![image-20200715145819947](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715145819947.png)

FutureTask中可以接受Callable参数；

![image-20200715145925971](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715145925971.png)

这样我们就可以先把Callable 放入到FutureTask中， 如何再把FutureTask 放入到Thread就可以了。

```java
public class CallableTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        for (int i = 1; i \< 10; i++) {
//            new Thread(new Runnable()).start();
//            new Thread(new FutureTask\\<>( Callable)).start();
            MyThread thread= new MyThread();
            //适配类：FutureTask
            FutureTask\<String> futureTask = new FutureTask\\<>(thread);
            //放入Thread使用
            new Thread(futureTask,String.valueOf(i)).start();
            //获取返回值
            String s = futureTask.get();
            System.out.println("返回值："+ s);
        }
    }
}

class MyThread implements Callable\<String> {

    @Override
    public String call() throws Exception {
        System.out.println("Call:"+Thread.currentThread().getName());
        return "String"+Thread.currentThread().getName();
    }
}
```

这样我们就可以使用Callable来进行多线程编程了，并且我们发现可以有返回值，并且可以抛出异常。

![image-20200715150056068](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715150056068.png)

注意两个重点：

![image-20200715150829757](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715150829757.png)

## 8、常用的辅助类(必会！)

### 8.1 CountDownLatch

![image-20200715154605191](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715154605191.png)

**其实就是一个减法计数器，对于计数器归零之后再进行后面的操作，这是一个计数器！**

```java
//这是一个计数器  减法
public class CountDownLatchDemo {

    public static void main(String[] args) throws InterruptedException {
        //总数是6
        CountDownLatch countDownLatch = new CountDownLatch(6);

        for (int i = 1; i \<= 6 ; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+" Go out");
                countDownLatch.countDown(); //每个线程都数量-1
            },String.valueOf(i)).start();
        }
        countDownLatch.await();  //等待计数器归零  然后向下执行

        System.out.println("close door");

    }

}
```

主要方法：

- countDown 减一操作；
- await 等待计数器归零。

await等待计数器为0，就唤醒，再继续向下运行。



### 8.2 CyclickBarrier

![image-20200715155823869](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715155823869.png)

其实就是一个加法计数器；

```java
public class CyclicBarrierDemo {
    public static void main(String[] args) {

        //主线程
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7,()->{
            System.out.println("召唤神龙~");
        });

        for (int i = 1; i \<= 7; i++) {
            //子线程
            int finalI = i;
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+" 收集了第 {"+ finalI+"} 颗龙珠");
                try {
                    cyclicBarrier.await(); //加法计数 等待
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }).start();
        }

    }
}
```







### 8.3 Semaphore



Semaphore：信号量

抢车位：

3个车位 6辆车：

```java
public class SemaphoreDemo {
    public static void main(String[] args) {
        //停车位为3个
        Semaphore semaphore = new Semaphore(3);
        for (int i = 1; i \<= 6; i++) {
            int finalI = i;
            new Thread(()->{
                try {
                    semaphore.acquire(); //得到
                    //抢到车位
                    System.out.println(Thread.currentThread().getName()+" 抢到了车位{"+ finalI +"}");
                    TimeUnit.SECONDS.sleep(2); //停车2s
                    System.out.println(Thread.currentThread().getName()+" 离开车位");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    semaphore.release();//释放
                }
            },String.valueOf(i)).start();
        }
    }
}
```

原理：

**semaphore.acquire()获得资源，如果资源已经使用完了，就等待资源释放后再进行使用！** 

**semaphore.release()释放，会将当前的信号量释放+1，然后唤醒等待的线程！**

作用： 多个共享资源互斥的使用！ 并发限流，控制最大的线程数！



## 9、读写锁



先对于不加锁的情况：

如果我们做一个我们自己的cache缓存。分别有写入操作、读取操作；

我们采用五个线程去写入，使用十个线程去读取。

我们来看一下这个的效果，如果我们不加锁的情况！

```java
package com.ogj.rw;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockDemo {
    public static void main(String[] args) {
        MyCache_ReadWriteLock mycache = new MyCache_ReadWriteLock();
        //开启5个线程 写入数据
        for (int i = 1; i \<=5 ; i++) {
            int finalI = i;
            new Thread(()->{
                mycache.put(String.valueOf(finalI),String.valueOf(finalI));
            }).start();
        }
        //开启10个线程去读取数据
        for (int i = 1; i \<=10 ; i++) {
            int finalI = i;
            new Thread(()->{
                String o = mycache.get(String.valueOf(finalI));
            }).start();
        }
    }
}

class MyCache_ReadWriteLock{
    private volatile Map\<String,String> map=new HashMap\\<>();

    public void put(String key,String value){
        //写入
        System.out.println(Thread.currentThread().getName()+" 线程 开始写入");
        map.put(key, value);
        System.out.println(Thread.currentThread().getName()+" 线程 写入OK");
    }

    public String get(String key){
        //得到
        System.out.println(Thread.currentThread().getName()+" 线程 开始读取");
        String o = map.get(key);
        System.out.println(Thread.currentThread().getName()+" 线程 读取OK");
        return o;
    }
}
```

运行效果如下：

```bash
Thread-0 线程 开始写入
Thread-4 线程 开始写入  # 插入了其他的线程进行写入
Thread-4 线程 写入OK
Thread-3 线程 开始写入
Thread-1 线程 开始写入
Thread-2 线程 开始写入
Thread-1 线程 写入OK
Thread-3 线程 写入OK
Thread-0 线程 写入OK   # 对于这种情况会出现 数据不一致等情况
Thread-2 线程 写入OK
Thread-5 线程 开始读取
Thread-6 线程 开始读取
Thread-6 线程 读取OK
Thread-7 线程 开始读取
Thread-7 线程 读取OK
Thread-5 线程 读取OK
Thread-8 线程 开始读取
Thread-8 线程 读取OK
Thread-9 线程 开始读取
Thread-9 线程 读取OK
Thread-10 线程 开始读取
Thread-11 线程 开始读取
Thread-12 线程 开始读取
Thread-12 线程 读取OK
Thread-10 线程 读取OK
Thread-14 线程 开始读取
Thread-13 线程 开始读取
Thread-13 线程 读取OK
Thread-11 线程 读取OK
Thread-14 线程 读取OK

Process finished with exit code 0

```



所以如果我们不加锁的情况，多线程的读写会造成数据不可靠的问题。

我们也可以采用**synchronized**这种重量锁和轻量锁 **lock**去保证数据的可靠。

但是这次我们采用更细粒度的锁：**ReadWriteLock** 读写锁来保证

![image-20200715170724964](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715170724964.png)

```java
package com.ogj.rw;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockDemo {
    public static void main(String[] args) {
        MyCache_ReadWriteLock mycache = new MyCache_ReadWriteLock();
        //开启5个线程 写入数据
        for (int i = 1; i \<=5 ; i++) {
            int finalI = i;
            new Thread(()->{
                mycache.put(String.valueOf(finalI),String.valueOf(finalI));
            }).start();
        }
        //开启10个线程去读取数据
        for (int i = 1; i \<=10 ; i++) {
            int finalI = i;
            new Thread(()->{
                String o = mycache.get(String.valueOf(finalI));
            }).start();
        }
    }
}

class MyCache_ReadWriteLock{
    private volatile Map\<String,String> map=new HashMap\\<>();

    //使用读写锁
    private ReadWriteLock readWriteLock=new ReentrantReadWriteLock();
    //普通锁
    private Lock lock=new ReentrantLock();

    public void put(String key,String value){
        //加锁
        readWriteLock.writeLock().lock();
        try {
            //写入
            //业务流程
            System.out.println(Thread.currentThread().getName()+" 线程 开始写入");
            map.put(key, value);
            System.out.println(Thread.currentThread().getName()+" 线程 写入OK");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.writeLock().unlock(); //解锁
        }
    }

    public String get(String key){
        //加锁
        String o="";
        readWriteLock.readLock().lock();
        try {
            //得到
            System.out.println(Thread.currentThread().getName()+" 线程 开始读取");
            o = map.get(key);
            System.out.println(Thread.currentThread().getName()+" 线程 读取OK");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.readLock().unlock();
        }
        return o;
    }
}
```

运行结果如下：

```bash
Thread-0 线程 开始写入
Thread-0 线程 写入OK
Thread-1 线程 开始写入
Thread-1 线程 写入OK
Thread-2 线程 开始写入
Thread-2 线程 写入OK
Thread-3 线程 开始写入
Thread-3 线程 写入OK
Thread-4 线程 开始写入
Thread-4 线程 写入OK

# 以上 整个过程没有再出现错乱的情况，对于读取，我们运行多个线程同时读取，因为这样不会造成数据不一致问题，也能在一定程度上提高效率
Thread-9 线程 开始读取
Thread-9 线程 读取OK
Thread-10 线程 开始读取
Thread-5 线程 开始读取
Thread-11 线程 开始读取
Thread-11 线程 读取OK
Thread-10 线程 读取OK
Thread-7 线程 开始读取
Thread-7 线程 读取OK
Thread-6 线程 开始读取
Thread-5 线程 读取OK
Thread-14 线程 开始读取
Thread-8 线程 开始读取
Thread-14 线程 读取OK
Thread-6 线程 读取OK
Thread-13 线程 开始读取
Thread-12 线程 开始读取
Thread-13 线程 读取OK
Thread-8 线程 读取OK
Thread-12 线程 读取OK
```



## 10、阻塞队列



阻塞

队列

![image-20200715214811539](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715214811539.png)

阻塞队列jdk1.8文档解释：

![image-20200715215418719](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715215418719.png)



### BlockingQueue

blockingQueue 是Collection的一个子类；

什么情况我们会使用 阻塞队列呢？

```
多线程并发处理、线程池！
```

![image-20200715220825475](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715220825475.png)

整个阻塞队列的家族如下：Queue以下实现的有Deque、AbstaractQueue、BlockingQueue；

BlockingQueue以下有Link链表实现的阻塞队列、也有Array数组实现的阻塞队列

### 如何使用阻塞队列呢？

----

操作：添加、移除

但是实际我们要学的有：

**四组API**

| 方式       | 抛出异常 | 不会抛出异常，有返回值 | 阻塞 等待 | 超时 等待                |
| ---------- | -------- | ---------------------- | --------- | ------------------------ |
| 添加       | add      | offer                  | put       | offer(timenum，timeUnit) |
| 移除       | remove   | poll                   | take      | poll(timenum，timeUnit)  |
| 判断队列首 | element  | peek                   | -         | -                        |

```java
/**
     * 抛出异常
     */
    public static void test1(){
        //需要初始化队列的大小
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue\\<>(3);

        System.out.println(blockingQueue.add("a"));
        System.out.println(blockingQueue.add("b"));
        System.out.println(blockingQueue.add("c"));
        //抛出异常：java.lang.IllegalStateException: Queue full
//        System.out.println(blockingQueue.add("d"));
        System.out.println(blockingQueue.remove());
        System.out.println(blockingQueue.remove());
        System.out.println(blockingQueue.remove());
        //如果多移除一个
        //这也会造成 java.util.NoSuchElementException 抛出异常
        System.out.println(blockingQueue.remove());
    }
=======================================================================================
/**
     * 不抛出异常，有返回值
     */
    public static void test2(){
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue\\<>(3);
        System.out.println(blockingQueue.offer("a"));
        System.out.println(blockingQueue.offer("b"));
        System.out.println(blockingQueue.offer("c"));
        //添加 一个不能添加的元素 使用offer只会返回false 不会抛出异常
        System.out.println(blockingQueue.offer("d"));

        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        //弹出 如果没有元素 只会返回null 不会抛出异常
        System.out.println(blockingQueue.poll());
    }
=======================================================================================
/**
     * 等待 一直阻塞
     */
    public static void test3() throws InterruptedException {
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue\\<>(3);

        //一直阻塞 不会返回
        blockingQueue.put("a");
        blockingQueue.put("b");
        blockingQueue.put("c");

        //如果队列已经满了， 再进去一个元素  这种情况会一直等待这个队列 什么时候有了位置再进去，程序不会停止
//        blockingQueue.put("d");

        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        System.out.println(blockingQueue.take());
        //如果我们再来一个  这种情况也会等待，程序会一直运行 阻塞
        System.out.println(blockingQueue.take());
    }
=======================================================================================
/**
     * 等待 超时阻塞
     *  这种情况也会等待队列有位置 或者有产品 但是会超时结束
     */
    public static void test4() throws InterruptedException {
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue\\<>(3);
        blockingQueue.offer("a");
        blockingQueue.offer("b");
        blockingQueue.offer("c");
        System.out.println("开始等待");
        blockingQueue.offer("d",2, TimeUnit.SECONDS);  //超时时间2s 等待如果超过2s就结束等待
        System.out.println("结束等待");
        System.out.println("===========取值==================");
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println(blockingQueue.poll());
        System.out.println("开始等待");
        blockingQueue.poll(2,TimeUnit.SECONDS); //超过两秒 我们就不要等待了
        System.out.println("结束等待");
    }
```



### SynchronousQueue同步队列



同步队列 没有容量，也可以视为容量为1的队列；

进去一个元素，必须等待取出来之后，才能再往里面放入一个元素；

**put**方法 和 **take**方法；

**Synchronized** 和 其他的**BlockingQueue** 不一样  它不存储元素；

put了一个元素，就必须从里面先take出来，否则不能再put进去值！

并且SynchronousQueue 的take是使用了**lock锁保证线程安全**的。

```java
/**
 * 同步队列
 */
public class SynchronousQueueDemo {
    public static void main(String[] args) {
        BlockingQueue\<String> synchronousQueue = new SynchronousQueue\\<>();
        //研究一下 如果判断这是一个同步队列

        //使用两个进程
        // 一个进程 放进去
        // 一个进程 拿出来
        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName()+" Put 1");
                synchronousQueue.put("1");
                System.out.println(Thread.currentThread().getName()+" Put 2");
                synchronousQueue.put("2");
                System.out.println(Thread.currentThread().getName()+" Put 3");
                synchronousQueue.put("3");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"T1").start();

        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName()+" Take "+synchronousQueue.take());
//                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName()+" Take "+synchronousQueue.take());
//                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName()+" Take "+synchronousQueue.take());

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"T2").start();
    }
}
```

![image-20200715230517760](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200715230517760.png)





## 11、线程池(重点)

线程池：**三大方法、7大参数、4种拒绝策略**

>池化技术

程序的运行，本质：占用系统的资源！我们需要去优化资源的使用 ===> 池化技术

线程池、JDBC的连接池、内存池、对象池  等等。。。。

资源的创建、销毁十分消耗资源

**池化技术**：事先准备好一些资源，如果有人要用，就来我这里拿，用完之后还给我，以此来提高效率。

**线程池的好处：**

1、降低资源的消耗；

2、提高响应的速度；

3、方便管理；

**==线程复用、可以控制最大并发数、管理线程；==**



> 线程池：三大方法



- **ExecutorService threadPool = Executors.newSingleThreadExecutor();//单个线程**
- **ExecutorService threadPool2 = Executors.newFixedThreadPool(5); //创建一个固定的线程池的大小**
- **ExecutorService threadPool3 = Executors.newCachedThreadPool(); //可伸缩的**

```java
//工具类 Executors 三大方法；
public class Demo01 {
    public static void main(String[] args) {

        ExecutorService threadPool = Executors.newSingleThreadExecutor();//单个线程
        ExecutorService threadPool2 = Executors.newFixedThreadPool(5); //创建一个固定的线程池的大小
        ExecutorService threadPool3 = Executors.newCachedThreadPool(); //可伸缩的

        //线程池用完必须要关闭线程池
        try {

            for (int i = 1; i \<=100 ; i++) {
                //通过线程池创建线程
                threadPool.execute(()->{
                    System.out.println(Thread.currentThread().getName()+ " ok");
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            threadPool.shutdown();
        }
    }
}
```



> 7大参数

源码分析

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue\<Runnable>()));
}
```

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue\<Runnable>());
}
```

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue\<Runnable>());
}
```

本质：三种方法都是开启的**ThreadPoolExecutor**

```java
public ThreadPoolExecutor(int corePoolSize,  //核心线程池大小
                          int maximumPoolSize, //最大的线程池大小
                          long keepAliveTime,  //超时了没有人调用就会释放
                          TimeUnit unit, //超时单位
                          BlockingQueue\<Runnable> workQueue, //阻塞队列
                          ThreadFactory threadFactory, //线程工厂 创建线程的 一般不用动
                          RejectedExecutionHandler handler //拒绝策略
                         ) {
    if (corePoolSize \< 0 ||
        maximumPoolSize \<= 0 ||
        maximumPoolSize \< corePoolSize ||
        keepAliveTime \< 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```

![image-20200716083909144](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200716083909144.png)

阿里巴巴的Java操作手册中明确说明：对于Integer.MAX_VALUE初始值较大，所以一般情况我们要使用底层的**ThreadPoolExecutor**来创建线程池。

> 业务图

![image-20200716133005124](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200716133005124.png)

> 手动创建线程池





> 拒绝策略4种

![image-20200716134748357](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200716134748357.png)

**（1）new ThreadPoolExecutor.AbortPolicy()：** //该拒绝策略为：银行满了，还有人进来，不处理这个人的，并抛出异常

超出最大承载，就会抛出异常：队列容量大小+maxPoolSize

![image-20200718214858130](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718214858130.png)

**（2）new ThreadPoolExecutor.CallerRunsPolicy()：** //该拒绝策略为：哪来的去哪里  main线程进行处理

![image-20200718215243449](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718215243449.png)

**（3）new ThreadPoolExecutor.DiscardPolicy():** //该拒绝策略为：队列满了,丢掉异常，不会抛出异常。

![image-20200718215402026](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718215402026.png)

**（4）new ThreadPoolExecutor.DiscardOldestPolicy()：**  //该拒绝策略为：队列满了，尝试去和最早的进程竞争，不会抛出异常

![image-20200718215707893](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718215707893.png)



> 小结和拓展

----

#### 如何去设置线程池的最大大小如何去设置？

##### CPU密集型和IO密集型！

---

**1、CPU密集型：电脑的核数是几核就选择几；选择maximunPoolSize的大小**

![image-20200718220112359](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718220112359.png)

我们可以使用代码来来获取逻辑处理器数量。

于是**cpu密集型**的写法如下：

![image-20200718220314770](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718220314770.png)



**2、I/O密集型：**

在程序中有15个大型任务，io十分占用资源；I/O密集型就是判断我们程序中十分耗I/O的线程数量，大约是最大I/O数的一倍到两倍之间。





## 12、四大函数式接口（必需掌握）

新时代的程序员：**lambda表达式、链式编程、函数式接口、Stream流式计算**

> 函数式接口：只有一个方法的接口

```java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
//超级多的@FunctionalInterface
//简化编程模型，在新版本的框架底层大量应用
//foreach()的参数也是一个函数式接口，消费者类的函数式接口
```

![image-20200718221832138](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718221832138.png)

函数型接口可以使用lambda表达式；

**代码测试：**

> Function函数型接口

![image-20200718222044307](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718222044307.png)

```java
/**
 * Function函数型接口
 */
public class Demo01 {
    public static void main(String[] args) {
        Function\<String,String> function = (str) ->{return str;};
        System.out.println(function.apply("starasdas"));
    }
}
```

> Predicate断定型接口

![image-20200718222658252](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718222658252.png)

```java
/**
 * 断定型接口：有一个输入参数，返回值只能是 布尔值！
 */
public class Demo2 {
    public static void main(String[] args) {
        //判断字符串是否为空
        Predicate\<String> predicate = (str)->{return str.isEmpty();};
        System.out.println(predicate.test("11"));
        System.out.println(predicate.test(""));
    }
}
```

---------

> Consummer 消费型接口



![image-20200718223309664](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718223309664.png)

```java
/**
 * 消费型接口 没有返回值！只有输入！
 */
public class Demo3 {
    public static void main(String[] args) {
        Consumer\<String> consumer = (str)->{
            System.out.println(str);
        };
        consumer.accept("abc");
    }
}
```





> Supplier供给型接口

![image-20200718223646956](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718223646956.png)

```java
/**
 * 供给型接口，只返回，不输入
 */
public class Demo4 {
    public static void main(String[] args) {
        Supplier\<String> supplier = ()->{return "1024";};
        System.out.println(supplier.get());
    }
}
```

## 13、Stream流式计算

> 什么是Stream流式计算？

**存储+计算**！

**存储**：集合、MySQL

**计算**：流式计算~

##### === 链式编程 ===

```java
public class Test {
    public static void main(String[] args) {
        User user1 = new User(1,"a",21);
        User user2 = new User(2,"b",22);
        User user3 = new User(3,"c",23);
        User user4 = new User(4,"d",24);
        User user5 = new User(5,"e",25);
        User user6 = new User(6,"f",26);
        List\<User> list = Arrays.asList(user1, user2, user3, user4, user5, user6);

        //计算交给流
        //链式编程！！！！
        list.stream()
                .filter((u)->{ return u.getId()%2==0; })
                .filter((u)->{return u.getAge()>23;})
                .map((u)->{return u.getName().toUpperCase();})
                .sorted((uu1,uu2)->{
                    return uu2.compareTo(uu1);
                })
                .limit(1)
                .forEach(System.out::println);
    }
}
```



## 14、ForkJoin

> 什么是ForkJoin？

ForkJoin 在JDK1.7，并行执行任务！提高效率~。在大数据量速率会更快！

大数据中：**MapReduce 核心思想->把大任务拆分为小任务！**

![image-20200718230010219](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718230010219.png)



> **ForkJoin 特点： 工作窃取！**

实现原理是：**双端队列**！从上面和下面都可以去拿到任务进行执行！

![image-20200718230259762](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718230259762.png)



> 如何使用ForkJoin?

- 1、通过**ForkJoinPool**来执行
- 2、计算任务 **execute(ForkJoinTask\<?> task)**

![image-20200718231444762](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718231444762.png)

- 3、计算类要去继承ForkJoinTask；

**ForkJoin的计算类！**

```java
package com.ogj.forkjoin;

import java.util.concurrent.RecursiveTask;

public class ForkJoinDemo extends RecursiveTask\<Long> {

    private long star;
    private long end;

    //临界值
    private long temp=1000000L;

    public ForkJoinDemo(long star, long end) {
        this.star = star;
        this.end = end;
    }

    /**
     * 计算方法
     * @return Long
     */
    @Override
    protected Long compute() {
        if((end-star)\<temp){
            Long sum = 0L;
            for (Long i = star; i \< end; i++) {
                sum+=i;
            }
//            System.out.println(sum);
            return sum;
        }else {
            //使用forkJoin 分而治之 计算
            //计算平均值
            long middle = (star+ end)/2;
            ForkJoinDemo forkJoinDemoTask1 = new ForkJoinDemo(star, middle);
            forkJoinDemoTask1.fork();  //拆分任务，把线程任务压入线程队列
            ForkJoinDemo forkJoinDemoTask2 = new ForkJoinDemo(middle, end);
            forkJoinDemoTask2.fork();  //拆分任务，把线程任务压入线程队列
            long taskSum = forkJoinDemoTask1.join() + forkJoinDemoTask2.join();
            return taskSum;
        }
    }
}

```

**测试类！**

```java
package com.ogj.forkjoin;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.ForkJoinTask;
import java.util.stream.LongStream;

public class Test {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        test1();
        test2();
        test3();
    }

    /**
     * 普通计算
     */
    public static void test1(){
        long star = System.currentTimeMillis();
        long sum = 0L;
        for (long i = 1; i \< 20_0000_0000; i++) {
            sum+=i;
        }
        long end = System.currentTimeMillis();
        System.out.println("sum="+"时间："+(end-star));
        System.out.println(sum);
    }

    /**
     * 使用ForkJoin
     */
    public static void test2() throws ExecutionException, InterruptedException {
        long star = System.currentTimeMillis();
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        ForkJoinTask\<Long> task = new ForkJoinDemo(0L, 20_0000_0000L);
        ForkJoinTask\<Long> submit = forkJoinPool.submit(task);
        Long aLong = submit.get();
        System.out.println(aLong);
        long end = System.currentTimeMillis();
        System.out.println("sum="+"时间："+(end-star));
    }


    /**
     * 使用Stream 并行流
     */
    public static void test3(){
        long star = System.currentTimeMillis();
        //Stream并行流()
        long sum = LongStream.range(0L, 20_0000_0000L).parallel().reduce(0, Long::sum);
        System.out.println(sum);
        long end = System.currentTimeMillis();
        System.out.println("sum="+"时间："+(end-star));
    }
}
```

![image-20200718234047257](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718234047257.png)

**.parallel().reduce(0, Long::sum)使用一个并行流去计算整个计算，提高效率。**

**reduce方法的优点：**

![image-20200718234804521](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200718234804521.png)



## 15、异步回调

> Future 设计的初衷：对将来的某个事件结果进行建模！

其实就是前端 --> 发送ajax异步请求给后端

![image-20200719214245164](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200719214245164.png)

但是我们平时都使用**CompletableFuture**

#### （1）没有返回值的runAsync异步回调

```java
public static void main(String[] args) throws ExecutionException, InterruptedException 
{
        // 发起 一个 请求

        System.out.println(System.currentTimeMillis());
        System.out.println("---------------------");
        CompletableFuture\<Void> future = CompletableFuture.runAsync(()->{
            //发起一个异步任务
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+".....");
        });
        System.out.println(System.currentTimeMillis());
        System.out.println("------------------------------");
        //输出执行结果
        System.out.println(future.get());  //获取执行结果
 }
```

#### （2）有返回值的异步回调supplyAsync

```java
//有返回值的异步回调
CompletableFuture\<Integer> completableFuture=CompletableFuture.supplyAsync(()->{
    System.out.println(Thread.currentThread().getName());
    try {
        TimeUnit.SECONDS.sleep(2);
        int i=1/0;
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return 1024;
});
System.out.println(completableFuture.whenComplete((t, u) -> {
    //success 回调
    System.out.println("t=>" + t); //正常的返回结果
    System.out.println("u=>" + u); //抛出异常的 错误信息
}).exceptionally((e) -> {
    //error回调
    System.out.println(e.getMessage());
    return 404;
}).get());
```

**whenComplete**: 有两个参数，一个是t 一个是u

T：是代表的 **正常返回的结果**；

U：是代表的 **抛出异常的错误信息**；

如果发生了异常，get可以获取到**exceptionally**返回的值；



## 16.JMM

> 请你谈谈你对Volatile 的理解

Volatile 是 Java 虚拟机提供 **轻量级的同步机制**

1、保证可见性

2、不保证原子性

3、禁止指令重排



> 什么是JMM？

**JMM：**JAVA内存模型，不存在的东西，是一个概念，也是一个约定！



**关于JMM的一些同步的约定：**

1、线程解锁前，必须把共享变量**立刻**刷回主存；

2、线程加锁前，必须读取主存中的最新值到工作内存中；

3、加锁和解锁是同一把锁；

线程中分为 **工作内存、主内存**

**8种操作**:

- **Read（读取）**：作用于主内存变量，它把一个变量的值从主内存传输到线程的工作内存中，以便随后的load动作使用；
- **load（载入）：**作用于工作内存的变量，它把read操作从主存中变量放入工作内存中；
- **Use（使用）：**作用于工作内存中的变量，它把工作内存中的变量传输给执行引擎，每当虚拟机遇到一个需要使用到变量的值，就会使用到这个指令；
- **assign（赋值）：**作用于工作内存中的变量，它把一个从执行引擎中接受到的值放入工作内存的变量副本中；
- **store（存储）：**作用于主内存中的变量，它把一个从工作内存中一个变量的值传送到主内存中，以便后续的write使用；
- **write（写入）：**作用于主内存中的变量，它把store操作从工作内存中得到的变量的值放入主内存的变量中；
- **lock（锁定）：**作用于主内存的变量，把一个变量标识为线程独占状态；
- **unlock（解锁）：**作用于主内存的变量，它把一个处于锁定状态的变量释放出来，释放后的变量才可以被其他线程锁定；

![image-20200727122005506](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727122005506.png)

![image-20200727122204321](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727122204321.png)

**JMM对这8种操作给了相应的规定**：

- 不允许read和load、store和write操作之一单独出现。即使用了read必须load，使用了store必须write
- 不允许线程丢弃他最近的assign操作，即工作变量的数据改变了之后，必须告知主存
- 不允许一个线程将没有assign的数据从工作内存同步回主内存
- 一个新的变量必须在主内存中诞生，不允许工作内存直接使用一个未被初始化的变量。就是对变量实施use、store操作之前，必须经过assign和load操作
- 一个变量同一时间只有一个线程能对其进行lock。多次lock后，必须执行相同次数的unlock才能解锁
- 如果对一个变量进行lock操作，会清空所有工作内存中此变量的值，在执行引擎使用这个变量前，必须重新load或assign操作初始化变量的值
- 如果一个变量没有被lock，就不能对其进行unlock操作。也不能unlock一个被其他线程锁住的变量
- 对一个变量进行unlock操作之前，必须把此变量同步回主内存

![image-20200727125122336](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727125122336.png)

遇到问题：**程序不知道主存中的值已经被修改过了！；**

## 17.Volatile

> 1、保证可见性

```java
public class JMMDemo01 {

    // 如果不加volatile 程序会死循环
    // 加了volatile是可以保证可见性的
    private volatile static Integer number = 0;

    public static void main(String[] args) {
        //main线程
        //子线程1
        new Thread(()->{
            while (number==0){
            }
        }).start();
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //子线程2
        new Thread(()->{
            while (number==0){
            }

        }).start();
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        number=1;
        System.out.println(number);
    }
}
```

> 2、不保证原子性

原子性：不可分割；

线程A在执行任务的时候，不能被打扰的，也不能被分割的，要么同时成功，要么同时失败。

```java
/**
 * 不保证原子性
 * number \<=2w
 * 
 */
public class VDemo02 {

    private static volatile int number = 0;

    public static void add(){
        number++; 
        //++ 不是一个原子性操作，是两个~3个操作
        //
    }

    public static void main(String[] args) {
        //理论上number  === 20000

        for (int i = 1; i \<= 20; i++) {
            new Thread(()->{
                for (int j = 1; j \<= 1000 ; j++) {
                    add();
                }
            }).start();
        }

        while (Thread.activeCount()>2){
            //main  gc
            Thread.yield();
        }
        System.out.println(Thread.currentThread().getName()+",num="+number);
    }
}
```

**如果不加lock和synchronized ，怎么样保证原子性？**



![image-20200727131011185](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727131011185.png)

解决方法：使用JUC下的原子包下的class；

![image-20200727131103821](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727131103821.png)

代码如下：

```java
public class VDemo02 {

    private static volatile AtomicInteger number = new AtomicInteger();

    public static void add(){
//        number++;
        number.incrementAndGet();  //底层是CAS保证的原子性
    }

    public static void main(String[] args) {
        //理论上number  === 20000

        for (int i = 1; i \<= 20; i++) {
            new Thread(()->{
                for (int j = 1; j \<= 1000 ; j++) {
                    add();
                }
            }).start();
        }

        while (Thread.activeCount()>2){
            //main  gc
            Thread.yield();
        }
        System.out.println(Thread.currentThread().getName()+",num="+number);
    }
}
```

这些类的底层都直接和操作系统挂钩！是在内存中修改值。

Unsafe类是一个很特殊的存在；

> 原子类为什么这么高级？

> 3、禁止指令重排

**什么是指令重排？**

==我们写的程序，计算机并不是按照我们自己写的那样去执行的==

源代码-->编译器优化重排-->指令并行也可能会重排-->内存系统也会重排-->执行

**处理器在进行指令重排的时候，会考虑数据之间的依赖性！**

```java
int x=1; //1
int y=2; //2
x=x+5;   //3
y=x*x;   //4

//我们期望的执行顺序是 1_2_3_4  可能执行的顺序会变成2134 1324
//可不可能是 4123？ 不可能的
```

可能造成的影响结果：前提：a b x y这四个值 默认都是0

| 线程A | 线程B |
| ----- | ----- |
| x=a   | y=b   |
| b=1   | a=2   |

正常的结果： x = 0; y =0;


| 线程A | 线程B |
| ----- | ----- |
| x=a   | y=b   |
| b=1   | a=2   |

可能在线程A中会出现，先执行b=1,然后再执行x=a；

在B线程中可能会出现，先执行a=2，然后执行y=b；

那么就有可能结果如下：x=2; y=1.



**volatile可以避免指令重排：**

**volatile中会加一道内存的屏障，这个内存屏障可以保证在这个屏障中的指令顺序。**

内存屏障：CPU指令。作用：

1、保证特定的操作的执行顺序；

2、可以保证某些变量的内存可见性（利用这些特性，就可以保证volatile实现的可见性）

![image-20200727133600857](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727133600857.png)



> 总结

- **volatile可以保证可见性；**
- **不能保证原子性**
- **由于内存屏障，可以保证避免指令重排的现象产生**

面试官：那么你知道在哪里用这个内存屏障用得最多呢？**单例模式**



## 18、玩转单例模式

饿汉式、DCL懒汉式

> 饿汉式

```java
/**
 * 饿汉式单例
 */
public class Hungry {

    /**
     * 可能会浪费空间
     */
    private byte[] data1=new byte[1024*1024];
    private byte[] data2=new byte[1024*1024];
    private byte[] data3=new byte[1024*1024];
    private byte[] data4=new byte[1024*1024];



    private Hungry(){

    }
    private final static Hungry hungry = new Hungry();

    public static Hungry getInstance(){
        return hungry;
    }

}
```



> DCL懒汉式

```java
//懒汉式单例模式
public class LazyMan {

    private static boolean key = false;

    private LazyMan(){
        synchronized (LazyMan.class){
            if (key==false){
                key=true;
            }
            else{
                throw new RuntimeException("不要试图使用反射破坏异常");
            }
        }
        System.out.println(Thread.currentThread().getName()+" ok");
    }
    private volatile static LazyMan lazyMan;

    //双重检测锁模式 简称DCL懒汉式
    public static LazyMan getInstance(){
        //需要加锁
        if(lazyMan==null){
            synchronized (LazyMan.class){
                if(lazyMan==null){
                    lazyMan=new LazyMan();
                    /**
                     * 1、分配内存空间
                     * 2、执行构造方法，初始化对象
                     * 3、把这个对象指向这个空间
                     *
                     *  就有可能出现指令重排问题
                     *  比如执行的顺序是1 3 2 等
                     *  我们就可以添加volatile保证指令重排问题
                     */
                }
            }
        }
        return lazyMan;
    }
    //单线程下 是ok的
    //但是如果是并发的
    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchFieldException {
        //Java中有反射
//        LazyMan instance = LazyMan.getInstance();
        Field key = LazyMan.class.getDeclaredField("key");
        key.setAccessible(true);
        Constructor\<LazyMan> declaredConstructor = LazyMan.class.getDeclaredConstructor(null);
        declaredConstructor.setAccessible(true); //无视了私有的构造器
        LazyMan lazyMan1 = declaredConstructor.newInstance();
        key.set(lazyMan1,false);
        LazyMan instance = declaredConstructor.newInstance();

        System.out.println(instance);
        System.out.println(lazyMan1);
        System.out.println(instance == lazyMan1);
    }
}
```

> 静态内部类



```java
//静态内部类
public class Holder {
    private Holder(){

    }
    public static Holder getInstance(){
        return InnerClass.holder;
    }
    public static class InnerClass{
        private static final Holder holder = new Holder();
    }
}
```



> 单例不安全, 因为反射

>枚举

```java
//enum 是什么？ enum本身就是一个Class 类
public enum EnumSingle {
    INSTANCE;
    public EnumSingle getInstance(){
        return INSTANCE;
    }
}

class Test{
    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        EnumSingle instance1 = EnumSingle.INSTANCE;
        Constructor\<EnumSingle> declaredConstructor = EnumSingle.class.getDeclaredConstructor(String.class,int.class);
        declaredConstructor.setAccessible(true);
        //java.lang.NoSuchMethodException: com.ogj.single.EnumSingle.\<init>()

        EnumSingle instance2 = declaredConstructor.newInstance();
        System.out.println(instance1);
        System.out.println(instance2);
    }
}
```

使用枚举，我们就可以防止反射破坏了。

![image-20200727142407100](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727142407100.png)

枚举类型使用JAD最终反编译后源码：

如果我们看idea 的文件：会发现idea骗了我们，居然告诉我们是有有参构造的，我们使用jad进行反编译。

![image-20200727142044342](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727142044342.png)

![image-20200727142000680](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727142000680.png)

```java
public final class EnumSingle extends Enum
{

    public static EnumSingle[] values()
    {
        return (EnumSingle[])$VALUES.clone();
    }

    public static EnumSingle valueOf(String name)
    {
        return (EnumSingle)Enum.valueOf(com/ogj/single/EnumSingle, name);
    }

    private EnumSingle(String s, int i)
    {
        super(s, i);
    }

    public EnumSingle getInstance()
    {
        return INSTANCE;
    }

    public static final EnumSingle INSTANCE;
    private static final EnumSingle $VALUES[];

    static 
    {
        INSTANCE = new EnumSingle("INSTANCE", 0);
        $VALUES = (new EnumSingle[] {
            INSTANCE
        });
    }
}
```

## 19、深入理解CAS

> 什么是CAS？

大厂必须深入研究底层！！！！**修内功！操作系统、计算机网络原理、组成原理、数据结构**

```java
public class casDemo {
    //CAS : compareAndSet 比较并交换
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(2020);

        //boolean compareAndSet(int expect, int update)
        //期望值、更新值
        //如果实际值 和 我的期望值相同，那么就更新
        //如果实际值 和 我的期望值不同，那么就不更新
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());

        //因为期望值是2020  实际值却变成了2021  所以会修改失败
        //CAS 是CPU的并发原语
        atomicInteger.getAndIncrement(); //++操作
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());
    }
}
```



![image-20200727153931186](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727153931186.png)



> Unsafe类

![image-20200727153538208](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727153538208.png)

![image-20200727153836929](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727153836929.png)

**总结：**

CAS：比较当前工作内存中的值 和 主内存中的值，如果这个值是期望的，那么则执行操作！如果不是就一直循环，使用的是自旋锁。

**缺点：**

- 循环会耗时；
- 一次性只能保证一个共享变量的原子性；
- 它会存在ABA问题



> CAS：ABA问题？(狸猫换太子)


线程1：期望值是1，要变成2；

线程2：两个操作：

- 1、期望值是1，变成3
- 2、期望是3，变成1

所以对于线程1来说，A的值还是1，所以就出现了问题，骗过了线程1；

```java
public class casDemo {
    //CAS : compareAndSet 比较并交换
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(2020);

        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());

        //boolean compareAndSet(int expect, int update)
        //期望值、更新值
        //如果实际值 和 我的期望值相同，那么就更新
        //如果实际值 和 我的期望值不同，那么就不更新
        System.out.println(atomicInteger.compareAndSet(2021, 2020));
        System.out.println(atomicInteger.get());

        //因为期望值是2020  实际值却变成了2021  所以会修改失败
        //CAS 是CPU的并发原语
//        atomicInteger.getAndIncrement(); //++操作
        System.out.println(atomicInteger.compareAndSet(2020, 2021));
        System.out.println(atomicInteger.get());
    }
}
```



## 20、原子引用

> 解决ABA问题，对应的思想：就是使用了**乐观锁~**

带版本号的 原子操作！

**Integer 使用了对象缓存机制，默认范围是-128~127，推荐使用静态工厂方法valueOf获取对象实例，而不是new，因为valueOf使用缓存，而new一定会创建新的对象分配新的内存空间。**

![image-20200727165850897](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727165850897.png)

所以如果遇到，使用大于128的时候，**使用原子引用的时候，如果超过了这个值，那么就不会进行版本上升！**

![image-20200727170215325](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727170215325.png)

那么如果我们使用小于128的时候：

![image-20200727170350647](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727170350647.png)

正常业务操作中，我们一般使用的是一个个对象，一般情况不会遇到这种情况。







## 21、各种锁的理解

---

#### 1、公平锁、非公平锁

**公平锁**：非常公平；不能插队的，必须先来后到；

```java
/**
 * Creates an instance of {@code ReentrantLock}.
 * This is equivalent to using {@code ReentrantLock(false)}.
 */
public ReentrantLock() {
    sync = new NonfairSync();
}
```

**非公平锁**：非常不公平，允许插队的，可以改变顺序。

```java
/**
 * Creates an instance of {@code ReentrantLock} with the
 * given fairness policy.
 *
 * @param fair {@code true} if this lock should use a fair ordering policy
 */
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

#### 2、可重入锁

可重入锁(递归锁)

![image-20200727171352076](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727171352076.png)

> Synchronized锁

```java
public class Demo01 {
    public static void main(String[] args) {
        Phone phone = new Phone();
        new Thread(()->{
            phone.sms();
        },"A").start();
        new Thread(()->{
            phone.sms();
        },"B").start();
    }

}

class Phone{
    public synchronized void sms(){
        System.out.println(Thread.currentThread().getName()+"=> sms");
        call();//这里也有一把锁
    }
    public synchronized void call(){
        System.out.println(Thread.currentThread().getName()+"=> call");
    }
}
```

> lock锁

```java
//lock
public class Demo02 {

    public static void main(String[] args) {
        Phone2 phone = new Phone2();
        new Thread(()->{
            phone.sms();
        },"A").start();
        new Thread(()->{
            phone.sms();
        },"B").start();
    }

}
class Phone2{

    Lock lock=new ReentrantLock();

    public void sms(){
        lock.lock(); //细节：这个是两把锁，两个钥匙
        //lock锁必须配对，否则就会死锁在里面
        try {
            System.out.println(Thread.currentThread().getName()+"=> sms");
            call();//这里也有一把锁
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            lock.unlock();
        }
    }
    public void call(){
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + "=> call");
        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            lock.unlock();
        }
    }
}
```

- lock锁必须配对，相当于lock和 unlock 必须数量相同；
- 在外面加的锁，也可以在里面解锁；在里面加的锁，在外面也可以解锁；

#### 3、自旋锁

spinlock

```java
public final int getAndAddInt(Object var1, long var2, int var4) {
    int var5;
    do {
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));
    return var5;
}
```

**自我设计自旋锁：**

```java
public class SpinlockDemo {

    //int 0
    //thread null
    AtomicReference\<Thread> atomicReference=new AtomicReference\\<>();

    //加锁
    public void myLock(){
        Thread thread = Thread.currentThread();
        System.out.println(thread.getName()+"===> mylock");

        //自旋锁
        while (!atomicReference.compareAndSet(null,thread)){
            System.out.println(Thread.currentThread().getName()+" ==> 自旋中~");
        }
    }


    //解锁
    public void myunlock(){
        Thread thread=Thread.currentThread();
        System.out.println(thread.getName()+"===> myUnlock");
        atomicReference.compareAndSet(thread,null);
    }

}
```

```java
public class TestSpinLock {
    public static void main(String[] args) throws InterruptedException {
        ReentrantLock reentrantLock = new ReentrantLock();
        reentrantLock.lock();
        reentrantLock.unlock();


        //使用CAS实现自旋锁
        SpinlockDemo spinlockDemo=new SpinlockDemo();
        new Thread(()->{
            spinlockDemo.myLock();
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                spinlockDemo.myunlock();
            }
        },"t1").start();

        TimeUnit.SECONDS.sleep(1);


        new Thread(()->{
            spinlockDemo.myLock();
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                spinlockDemo.myunlock();
            }
        },"t2").start();
    }
}
```

运行结果：

**t2进程必须等待t1进程Unlock后，才能Unlock，在这之前进行自旋等待。。。。**

![image-20200727185204974](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727185204974.png)





#### 4、死锁

> 死锁是什么？

\<img src="https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727191252276.png" alt="image-20200727191252276" style="zoom:150%;" />

死锁测试，怎么排除死锁：

```java
package com.ogj.lock;

import java.util.concurrent.TimeUnit;

public class DeadLock {
    public static void main(String[] args) {
        String lockA= "lockA";
        String lockB= "lockB";

        new Thread(new MyThread(lockA,lockB),"t1").start();
        new Thread(new MyThread(lockB,lockA),"t2").start();
    }
}

class MyThread implements Runnable{

    private String lockA;
    private String lockB;

    public MyThread(String lockA, String lockB) {
        this.lockA = lockA;
        this.lockB = lockB;
    }

    @Override
    public void run() {
        synchronized (lockA){
            System.out.println(Thread.currentThread().getName()+" lock"+lockA+"===>get"+lockB);
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (lockB){
                System.out.println(Thread.currentThread().getName()+" lock"+lockB+"===>get"+lockA);
            }
        }
    }
}
```

> 解决问题

**1、使用jps定位进程号，jdk的bin目录下： 有一个jps**

命令：`jps -l`

![image-20200727192321614](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727192321614.png)

**2、使用`jstack` 进程进程号 找到死锁信息**

![image-20200727192602880](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727192602880.png)

**一般情况信息在最后：**

![image-20200727192727234](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200727192727234.png)

**面试，工作中！排查问题！**

**1、日志**

**2、堆栈信息**



## 其他多线程的一些组件：

### 1、ThreadLocal

----

> **ThreadLocal是什么？**

ThreadLocal意思是对于每个线程都有自己的变量，而且这个变量都属于当前线程，该变量对其他线程是隔离的。ThreadLocal 为变量在每个线程中都创建了一个副本，那么每个线程可以访问自己内部的副本变量。

> **使用场景：**

- **在进行对象跨层传递的时候，使用ThreadLocal可以避免多次传递，打破层次间的约束；**
- **线程间数据隔离；**
- **进行事务操作，用于存储线程事务信息；**
- **数据库连接，用于存储Session会话管理。**

> **ThreadLocal的使用例子：**

```java
public class TestThreadLocal {
    public static void main(String[] args) {
        ThreadLocal\<String> local = new ThreadLocal\\<>();
        //新建一个随机数类
        Random random=new Random();
        IntStream.range(0,5).forEach(a->new Thread(()->{
            //为每一个线程设置相应的local值
            local.set(a+ " "+ random.nextInt(10));
            System.out.println("线程和local值分别是："+local.get());
            try {
                TimeUnit.SECONDS.sleep(1);
            }catch (InterruptedException e){
                e.printStackTrace();
            }
        }).start());
    }
}
```

对于以上情况，我们可以看见对于每一个线程，我们都有各自的local，并且我们设置了一个休眠时间，就是为了另外一个线程也能及时的读取到当前的local值。

> **源码分析：**

我们来看一下以下几个函数：get、set、remove、initialValue

**1、set函数**：

```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}
```

我们可以看到这个set方法中，首先获取到了当前线程t，然后调用getMap获取ThreadLocalMap，如果map存在，则将当前线程t作为key，把要存储的对象作为value存入到map中，如果map不存在，则初始化一个。

然后我们再来看一下 **ThreadLocalMap是什么？**

```java
static class ThreadLocalMap {
    static class Entry extends WeakReference\<ThreadLocal\<?>> {
            /** The value associated with this ThreadLocal. */
            Object value;

            Entry(ThreadLocal\<?> k, Object v) {
                super(k);
                value = v;
            }
        }
```

我们可以看到这个是一个静态内部类，里面定义了一个Entry来保存数据，而且这个Entry是对ThreadLocal的**弱引用**，在Entry内部使用**ThreadLocal作为key**，使用我们**设置的value作为value**。

还有一个函数是getMap函数，这个函数是返回的当前线程t中的成员变量**threadLocals其实就是ThreadLocalMap**

```java
ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}
```

**2、get方法**

```java
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```

这段代码的意思就是，首先获取当前线程，然后调用getMap方法获取一个ThreadLocalMap，如果map不为null，那么就把这个值作为这个key的值返回；如果map是null，那么就设置一个初始值：

```java
private T setInitialValue() {
    T value = initialValue();
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
    return value;
}
```

**3、remove方法**

```java
public void remove() {
     ThreadLocalMap m = getMap(Thread.currentThread());
     if (m != null)
         m.remove(this);
 }
```

直接把存在ThreadLocalMap中的值用当前线程作为key删除即可。

#### 总结：

- 每个Thread维护着一个ThreadLocalMap的引用；
- ThreadLocalMap是ThreadLocal的内部类，用Entry进行存储；
- ThreadLocal创建的副本是存储在自己的threadlocals中的，也就是自己的threadLocalMap中的。
- ThreadLocalMap 的 键值 为ThreadLocal对象，而且可以有多个threadLocal变量，因此是保存在map中的。这个map是一个hash表。
- 在进行get之前，必须先set，否则会报空指针异常，当然源码中也可以初始化一个，但是必须重写initialValue()方法。
- ThreadLocal本身并不存储值，它只是作为一个key来让线程从ThreadLocalMap中获取value。

#### 注意：

我们看一下ThreadLocal、Thread、CurrentThread的联系：

![image-20200803165858388](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200803165858388.png)

- Thread中有一个map，那就是ThreadLocalMap；
- ThreadLocalMap的key是ThreadLocal，值是我们set进去的；
- ThreadLocal是一个弱引用，当为null的时候，会被当做垃圾回收；
- **如果突然 ThreadLocal 是null了，也就是要被垃圾回收期回收了，但是此时我们的ThreadLocalMap生命周期和Thread的一样，它不会回收，这时候就出现了一个现象，那就是ThreadLocalMap的key没了，但是value还在，这样就会造成内存泄露！ 解决方案：在使用完ThreadLocal 后执行remove操作。**



### 2、synchronized锁升级的过程

---

synchronized在以前是没有锁升级的，但是在jdk1.6之后就有了锁升级。

分为了四种情况：

锁升级 **其实就是JVM优化 synchronized运行的机制，当JVM检测到当前的不同竞争状态的时候，会自动切换到适合的锁实现。**

锁升级是从 无锁 --> 偏向锁 --> 轻量级锁 -->重量级锁，**除了偏向锁可以降级为无锁的情况外，其他所有的锁升级都是单向的，不允许锁降级。**

注意：这个地方 升级和降级对于不同的JVM虚拟机是不同的，在HotSpot JVM中其实是支持锁降级的，但是锁降级效率较低，如果频繁升降级的话对性能就会造成很大的影响。重量级锁降级发生于STW阶段，

**降级的对象仅仅是被 VMThread 访问而没有被其他 JavaThread 访问的对象。**

- 无锁

- 偏向锁：

  - **偏向锁的介绍：**偏向锁，它会偏向第一个访问锁的线程，如果在运行过程中，同步锁只有一个线程访问，不存在多线程争用的情况，则线程是不需要触发同步的，这种情况下，就会给线程加一个偏向锁。

  - **偏向锁什么时候升级为轻量级锁：** **当在运行的过程中，遇到了其他线程抢占锁，则持有偏向锁的线程会被挂起，JVM会消除它身上的偏向锁，将提升到标准的轻量级锁。**

- 轻量级锁：

  - **如何晋升而来：**轻量级锁是偏向锁升级来的，偏向锁运行在一个线程进入同步块的地方，当第二个线程加入锁争用的时候，偏向锁就会升级为轻量级锁；
  - **轻量级锁的介绍**：轻量级锁考虑的是竞争锁对象的线程不多的时候，而且线程持有锁的时间也不长的情景。因为**阻塞线程需要CPU从用户态转到内核态**，代价较大，如果刚刚阻塞不久 这个锁就被释放了，那这个代价就得不偿失了，因此这个时候就干脆不阻塞这个线程，当**加了轻量级锁的资源的时候，其他线程来访问就让他自旋等待！**
  - **什么时候升级为重量级锁：** 对于轻量级锁的介绍，我们可以看到，轻量级锁为了减少cpu从用户态跳转到内核态，对进程进行自旋操作。但是这个自旋时间太长也不行，因为自旋也是要消耗CPU的，自旋的次数所以必须是有限制的，比如10次、100次，**如果自旋次数来到了这个阈值线程1还没有释放锁**、或者**线程1还在执行，线程2还在自旋等待的时候，这是又来了一个线程3过来竞争这个锁对象**，那么这个时候轻量级锁就会升级为重量级锁。

- 重量级锁

  - 重量级锁其实就是我们平时使用的synchronized锁，线程获取到重量级后，其他的线程都阻塞，防止CPU空转。

#### 总结：

**（1）偏向锁 适合单线程使用锁的情况**

**（2）轻量级锁 适合竞争较为不激烈的情况**

**（3）重量级锁 适合竞争特别激烈的情况**

### 3、CAS在JUC后用了Long Addr优化

-----

LongAddr 实现思路类似于ConcurrentHashMap，LongAddr有一个根据当前并发状态动态改变的Cell数组，Cell对象里面有一个long类型的value用来存储值；

> Long Addr的原理

​	开始没有并发争用的时候  或者 是Cells数组正在初始化的时候，会使用CAS来将累加到成员变量的base上，在并发争用的情况下，LongAddr 会初始化cells数组。

​	在Cell数组中选的一个Cell加锁，数组有多少个Cell就运行有多少线程进行修改，最后将数组中每个Cell中的value相加，在加上base的值，就是最终的值；Cell数组还能根据当前线程争用情况进行扩容，这也就是为什么LongAddr 比 CAS 和 AtomicInteger 效率要高的原因，后面两者都是volatile+cas实现的，他们的竞争纬度是1，LongAddr的竞争纬度是 Cell个数+1(base那个也要算上，相当于+1，如果竞争不到锁还会尝试将数值加到base上)；

```bash
`LongAdder`类与`AtomicLong`类的区别
(1)在于高并发时前者将对单一变量的CAS操作分散为对数组`cells`中多个元素的CAS操作，取值时进行求和；
(2)在并发较低时仅对`base`变量进行CAS操作，与`AtomicLong`类原理相同。
```



#### 4、Java的动态代理

---

代理是一种常用的设计模式，其目的 就是为了其他对象提供一个代理以控制对某个对象的访问。代理类负责为委托类预处理消息，过滤消息并转发消息，以及进行消息被委托执行后的后续处理。

为了保证行为的一致性，代理类和委托类通常会实现相同的接口，所以在访问者看来两者没有丝毫的区别。通过代理层这一中间层，能有效的控制对委托类对象的直接访问，也可以很好的隐藏和保护委托类对象，同时也为实施不同控制策略预留了空间，从而在设计上获得了更大的灵活性。

JAVA动态代理机制以巧妙的方式近乎完美地时间了代理模式的设计理念。

#### （1）动态代理的使用场景

动态代理的 好处是它比较灵活，可以在运行的时候才切入改变类的方法，而不需要预先定义它。动态代理一般我们比较少去手写，但是我们用得其实非常的多。

在Spring项目中用的注解，比如@Bean、@Autowired、事务注解@Transactional等都有用到，还有就是Spring的AOP切面编程。

动态代理，可以非常灵魂的在某个类，某个方法，某个代码点上切入我们想要的内容，就是动态代理其中的内容。

#### （2）动态代理分类：

动态代理分为JDK 和 cglib两种。

- jdk动态代理 主要用到了接口 invocationHandler，生成的代理的具体操作类，可以为一个或者多个接口动态的实现代理类；

  缺点：在于就是被代理的类必须是接口的实现类(依赖于接口)，如果某些类没有实现接口，就不能用JDK代理。

- cglib动态代理，原理是针对target类 生成一个子类，覆盖方法实现增强；

  缺点：基于继承 无法代理final类(因为final类无法被继承，如String类)





#### 5、Java的反射

---

#### （1）概述：

Java 反射机制是在运行的状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能 称为Java语言的反射机制。

我们如果想要解剖一个类，必须先获取到该类的字节码文件对象，而解剖使用的就是Class类中的方法，所以先要获取每一个字节码文件对应的Class类型的对象。

简单来说：反射就是把Java类中的各个成分映射成一个个的Java对象

比如：一个类有成员变量、方法、构造方法、包等信息，利用反射技术可以对一个类进行解剖，把个个组成部分映射成一个个对象。

#### （2）Java编译类型：

- **静态编译**： 在编译时确定类型，绑定对象即通过；
- **动态编译**：运行时确定类型，绑定对象。动态编译最大限度的发挥了Java的灵活性，体现了多态的应用，可以减少类与类之间的耦合性。

Java反射 是 Java被视为动态（准动态）语言的一个关键性质。这个机制允许程序在运行时通过Reflection APIs 取得任何一个已知name 的class内部信息，包括modifiers（public、static等）、superclass、实现之interface，也包括field 和methods 的所有信息，并且可以运行时改变fields内容 或 唤起methods。

Reflection 可以在运行时加载、探知、使用编译期间完全未知的classes。即Java程序可以加载一个运行时才得知名称的class，获取其完整构造，并生成其对象实体、或对其fields设值、或唤起其methods。

**反射允许静态语言在运行时（runtime）检测、修改程序的结构和行为。**

#### （3）反射是如何实现的呢？

实现 JAVA 反射机制的类都位于java.lang.reflect包中：

1、Class代表一个类；

2、Field代表类的成员变量

3、Method 代表类的方法

4、Constructor 代表类的构造方法

5、Array 类 提供动态创建数组，以及访问数组的元素的静态方法。

**本质一句话就是 反射可以赋予JVM动态编译的能力，否则类的元数据信息只能用静态编译的方式实现，例如热加载、Tomcat的classloader都没法支持。**

反射的源码 方法有：

**Method 源码方法：**

![image-20200804124422617](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200804124422617.png)



一个简单的反射使用：

```java
public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchFieldException {
        Apple apple = new Apple();
        apple.setName("红富士");
        apple.setPrice(2.5);
        apple.setDetail("这是一个苹果");

        System.out.println("-----使用反射构造------");
        //反射
        Class appleClass = Class.forName("com.ogj.test.reflect.Apple");
        Method method = appleClass.getMethod("setPrice", Double.class);
        Constructor constructor = appleClass.getConstructor();
        //使用构造器 new 了一个对象
        Apple newInstance = (Apple) constructor.newInstance();
        newInstance.setDetail("这是一个苹果哟");
        newInstance.setName("小苹果");
        newInstance.setPrice(5.5);
        System.out.println(newInstance.getDetail());
        System.out.println(newInstance.toString());
    }
```

#### （4）获得字节码的方式：

- Class.forName("com.ogj.test.pojo.Apple")；
- 对象.getClass()；
- 类名.Class；

#### （5）反射获取构造函数：

class.getConstructor(参数1，参数2，参数3);

后面添加多少个参数，就反射几个参数构造器，但是前提是类以及实现

对于反射 “私有” 构造函数：**添加 c.setAccessible(true)即可** 暴力反射！！！

如果我们不进行暴力破解，就会出现无法反射使用函数 异常：

```java
Class\<? extends Apple> aClass = apple.getClass();
Apple apple1 = aClass.newInstance();
apple1.setPrice(5.0);
apple1.setName("苹果2");
apple1.setDetail("1111");

System.out.println(apple1.toString());

Method testReflect = aClass.getDeclaredMethod("testReflect", String.class);
//testReflect.setAccessible(true);  //添加私有访问权限
testReflect.invoke(apple1, "测试1");
```

```java
Exception in thread "main" java.lang.IllegalAccessException: Class com.ogj.test.reflect.TestReflection can not access a member of class com.ogj.test.reflect.Apple with modifiers "private"
	at sun.reflect.Reflection.ensureMemberAccess(Reflection.java:102)
	at java.lang.reflect.AccessibleObject.slowCheckMemberAccess(AccessibleObject.java:296)
	at java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:288)
	at java.lang.reflect.Method.invoke(Method.java:491)
	at com.ogj.test.reflect.TestReflection.main(TestReflection.java:41)
```

```java
Field field = appleClass.getDeclaredField("price");
System.out.println(field.getType());
```

获取指定字段的类型。

#### （6）如果一个对象中有一个list的泛型类型，我们怎么获取这个泛型？

可以先获取到这个字段，然后再通过**getGenericType** 获取泛型类型；

```java
Field declaredField = appleClass.getDeclaredField("listString");
System.out.println(declaredField.getGenericType()); //获取泛型类型
```



### 4、AQS的实现

---

AQS基本框架如下图所示：

![image-20200826103926005](https://image-bk.oss-cn-shanghai.aliyuncs.com/docs/imagesimage-20200826103926005.png)

AQS维护了一个volatile语义(支持多线程下的可见性)的共享资源变量state和一个FIFO线程等待队列(多线程竞争state被阻塞时会进入此队列)。

#### State共享资源变量

int类型；

- getState()
- setState(int newState)
- compareAndSetState(int expect,int update)

以上3种方式均为原子操作，其中compareAndSetState()的实现依赖于**Unsafe的compareAndSwapInt()**方法

```java
/**
* The synchronization state.
*/
private volatile int state;
protected final int getState() {
    return state;
}
/**
 * Sets the value of synchronization state.
 * This operation has memory semantics of a {@code volatile} write.
 * @param newState the new state value
 */
protected final void setState(int newState) {
    state = newState;
}
protected final boolean compareAndSetState(int expect, int update) {
    // See below for intrinsics setup to support this
    return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
}
```

资源共享的两种方式：

- 独占式：只有单个线程能够成功获取资源并执行，如ReentrantLock
- 共享式：多个线程可成功获取资源并执行，如Semaphore/CountDownLatch等

AQS将大部分的同步逻辑均已实现好，继承的自定义同步器只需要实现state的获取(acquire)和释放(release)的逻辑代码就可以了，主要包括下面方法：

- tryAcquire(int)：独占方式。尝试获取资源，成功则返回true，失败则返回false。
- tryRelease(int)：独占方式。尝试释放资源，成功则返回true，失败则返回false。
- tryAcquireShared(int)：共享方式。尝试获取资源。负数表示失败，0表示成功，但没有剩余可用资源；正数表示成功，并且剩余资源。
- isHeldExclusively()：该线程是否正在独占资源。只有用到condition才需要去实现它。



AQS需要子类复写的方法均没有声明为abstract，目的是避免子类需要强制性覆盖多个方法，因为一般自定义同步器要么是独占方法，要么是共享方法，只需要实现tryAcquire-tryRelease、tryAcquireShared-tryReleaseShared中的一种即可。

当然，AQS也支持子类同时实现独占和共享两种模式，如ReentrantReadWirteLock。



#### CLH队列（FIFO）

-----

AQS是通过内部类Node来实现FIFO队列的，源代码如下：

```java
static final class Node {
    
    // 表明节点在共享模式下等待的标记
    static final Node SHARED = new Node();
    // 表明节点在独占模式下等待的标记
    static final Node EXCLUSIVE = null;

    // 表征等待线程已取消的
    static final int CANCELLED =  1;
    // 表征需要唤醒后续线程
    static final int SIGNAL    = -1;
    // 表征线程正在等待触发条件(condition)
    static final int CONDITION = -2;
    // 表征下一个acquireShared应无条件传播
    static final int PROPAGATE = -3;

    /**
     *   SIGNAL: 当前节点释放state或者取消后，将通知后续节点竞争state。
     *   CANCELLED: 线程因timeout和interrupt而放弃竞争state，当前节点将与state彻底拜拜
     *   CONDITION: 表征当前节点处于条件队列中，它将不能用作同步队列节点，直到其waitStatus被重置为0
     *   PROPAGATE: 表征下一个acquireShared应无条件传播
     *   0: None of the above
     */
    volatile int waitStatus;
    
    // 前继节点
    volatile Node prev;
    // 后继节点
    volatile Node next;
    // 持有的线程
    volatile Thread thread;
    // 链接下一个等待条件触发的节点
    Node nextWaiter;

    // 返回节点是否处于Shared状态下
    final boolean isShared() {
        return nextWaiter == SHARED;
    }

    // 返回前继节点
    final Node predecessor() throws NullPointerException {
        Node p = prev;
        if (p == null)
            throw new NullPointerException();
        else
            return p;
    }
    
    // Shared模式下的Node构造函数
    Node() {  
    }

    // 用于addWaiter
    Node(Thread thread, Node mode) {  
        this.nextWaiter = mode;
        this.thread = thread;
    }
    
    // 用于Condition
    Node(Thread thread, int waitStatus) {
        this.waitStatus = waitStatus;
        this.thread = thread;
    }
}
```

当waitStatus非负的时候，表征不可用，正数代表处于等待状态，所以waitStatus只需要检查其正负符号即可，不用太多关注特定值。

#### 1、获取资源（独占模式）

##### （1）acquire（int）：

独占模式下的获取/释放资源过程，入口方法为：

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

tryAcquire(arg)为线程获取资源的方法函数，在AQS中定义如下：

```java
protected boolean tryAcquire(int arg) {
    throw new UnsupportedOperationException();
}
```

我们发现这个方法是一个空方法，并且由protected修饰，**说明该方法需要由子类即自定义同步器来实现。**

acquire()方法至少执行一次tryAcquire(arg)，若返回true，则acquire直接返回，否则进入**acquireQueued(addWaiter(Node.EXCLUSIVE), arg))**方法。

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

acquireQueued方法分为3个步骤：

- addWrite()将当前线程加入到等待队列的尾部，并标记为独占模式；
- acquireQueued()使线程在等待队列中获取资源，直到获取到资源再返回，若整个等待过程中被中断过，则返回true，否则返回false；
- 如果线程在等待过程中被中断过，则先标记上，待获取到资源后再进行自我中断**selfInterrupt**，将中断响应掉。

##### （2）tryAcquire(int)：

tryAcquire 尝试以独占的模式获取资源，如果获取成功则返回True，否则直接返回False，默认实现是抛出**UnsupportedOperationException**，具体实现由自定义扩展了AQS的同步器来完成。

##### （3）addWaiter(Node):

```java
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    // Try the fast path of enq; backup to full enq on failure
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}
```

##### （5）enq(node)方法：

```java
private Node enq(final Node node) {
    for (;;) {
        Node t = tail;
        if (t == null) { // Must initialize
            if (compareAndSetHead(new Node()))
                tail = head;
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}
```

常规插入、快速插入的区别：

1、常规插入是自旋操作(for(;;))，一定能保证插入成功；

2、常规插入比快速插入多包含了一种情况，即当前等待队列为null的时候，需要初始化队列，即将待插入的节点设置为头节点，同时为为节点。

常规插入和快速插入都依赖于CAS，其实都是unsafe的类：

```java
private final boolean compareAndSetHead(Node update) {
    return unsafe.compareAndSwapObject(this, headOffset, null, update);
}
private final boolean compareAndSetTail(Node expect, Node update) {
    return unsafe.compareAndSwapObject(this, tailOffset, expect, update);
}
```

unsafe的操作都是native的方法，由计算机底层CPU的cmpxchg指令来保证其原子性。

我们再来看看**acquireQueued**方法：

```java
final boolean acquireQueued(final Node node, int arg) {
    //标识是否获取资源失败
    boolean failed = true;
    try {
        //标识当前线程是否被中断过
        boolean interrupted = false;
        for (;;) {
            //获取当前节点的前驱节点
            final Node p = node.predecessor();
            //如果前驱节点为头结点，那么说明排队马上排到自己了，可以尝试获取资源;
            //如果获取资源成功，则实现操作
            if (p == head && tryAcquire(arg)) {
                //将当前节点设置为头节点
                setHead(node);
                //说明前驱节点以及释放了资源了，将其next置为空，以方便虚拟机来回收掉该前驱节点
                p.next = null; // help GC
                //标记获取资源成功
                failed = false;
                //返回中断标记
                return interrupted;
            }
            //若前驱节点不是头结点，或者获取资源失败，
            //则需要通过shouldParkAfterFailedAcquire函数
            //判断是否需要阻塞该节点持有的线程
            //若shouldParkAfterFailedAcquire函数返回true，
            //则继续执行parkAndCheckInterrupt函数
            //将该线程阻塞并检查是否可以中断，若返回true，则将interrupted标志置为true
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
         // 最终获取资源失败，则当前节点放弃获取资源
        if (failed)
            cancelAcquire(node);
    }
}
```

**shouldParkAfterFailedAcquire**函数：

```java
// shouldParkAfterFailedAcquire 是通过前驱节点的waitStatus值来判断是否阻塞当前节点的线程的
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
    // 获取前驱节点的waitStatus值ws
    int ws = pred.waitStatus;
    // 如果ws的值为Node.SIGNAL(-1)，则直接返回true
    // 说明前驱节点完成资源的释放或者中断后，会通知当前节点，不需要自旋频繁的来打听消息
    if (ws == Node.SIGNAL)
        return true;
    // 如果前驱节点的ws值大于0，即为1，说明前驱节点处于放弃状态(Cancelled)
    // 那就继续往前遍历，知道当前节点的前驱节点的ws值为0或者负数。
    // if(p==head && tryAcquire(arg)) acquireQueued方法才能够跳出自旋过程
    if (ws > 0) {
        do {
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);
        pred.next = node;
    } else {
        /*
         * waitStatus must be 0 or PROPAGATE.  Indicate that we
         * need a signal, but don't park yet.  Caller will need to
         * retry to make sure it cannot acquire before parking.
         */
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
    }
    return false;
}
```

**parkAndCheckInterrupt**函数：

```java
private final boolean parkAndCheckInterrupt() {
    LockSupport.park(this);
    return Thread.interrupted();
}
```

这个函数 主要就是调用LockSupport类的park方法阻塞当前线程，并返回线程是否被中断过。

总结，独占模式下的acquire的代码：

- 首先线程通过tryAcquire(arg)尝试获取共享资源，若获取成功则直接返回，若不成功，则将该线程以独占模式添加到等待队列尾部，tryAcquire(arg)由继承AQS的自定义同步器来具体实现；
- 当前线程加入等待队列后，会通过acquireQueued方法基于CAS资源不断尝试获取资源，直到获取到资源；
- 若在自旋过程中，线程被中断过，acquireQueued方法会标记此次中断，并返回true。
- 若acquireQueued方法获取到资源后，返回true，则执行线程自我中断操作selfInterrupt()。



#### 2、释放资源(独占模式)：

AQS的释放资源过程，其入口函数为：

```java
public final boolean release(int arg) {
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

通过tryRelease(arg)来释放资源；

和tryAcquire类似，tryRelease也是由继承AQS的自定义同步器来具体实现。

```java
protected boolean tryRelease(int arg) {
    throw new UnsupportedOperationException();
}
```

**unparkSuccessor**函数：

```java
private void unparkSuccessor(Node node) {
    //获取当前节点的ws值
    int ws = node.waitStatus;
    //如果小于0则置为0
    if (ws \< 0)
        compareAndSetWaitStatus(node, ws, 0);

   
    Node s = node.next;
    // 若后驱节点为null或者其ws值大于0(放弃状态),则从等待队列的为节点从后往前搜索
    // 搜索到等待队列中最靠前的ws值非正且非null的节点
    if (s == null || s.waitStatus > 0) {
        s = null;
        for (Node t = tail; t != null && t != node; t = t.prev)
            if (t.waitStatus \<= 0)
                s = t;
    }
    // 如果后驱节点非null，则唤醒该后驱节点持有的线程
    if (s != null)
        LockSupport.unpark(s.thread);
}
```





#### 3、获取资源（共享模式）

入口方法：

```java
public final void acquireShared(int arg) {
    if (tryAcquireShared(arg) \< 0)
        doAcquireShared(arg);
}
```

执行tryAcquireShared方法获取资源，若获取成功则直接返回，若失败，则进入等待队列，执行自旋获取资源，具体由doAcquireShared方法来实现。

##### tryAcquireShared由继承AQS的定义同步器来具体实现

返回值： 负代表失败；

​		        0代表获取成功，但无剩余资源；

​				正值代表获取成功且有剩余资源，其他线程可去获取；

```java
private void doAcquireShared(int arg) {
    //将线程以共享模式添加到队列的尾部
    final Node node = addWaiter(Node.SHARED);
    //初始化失败的标志
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            //获取当前的前驱节点
            final Node p = node.predecessor();
            //如果前驱节点为头节点，就执行tryAcquireShared 获取资源
            if (p == head) {
                int r = tryAcquireShared(arg);
                // 若获取资源成功，且r>=0 剩余有资源，就讲证据设为头结点并唤醒后序的阻塞线程
                if (r >= 0) {
                    setHeadAndPropagate(node, r);
                    p.next = null; // help GC
                    //如果中断标志位真，就线程执行自我了断
                    if (interrupted)
                        selfInterrupt();
                    failed = false;
                    return;
                }
            }
            // shouldParkAfterFailedAcquire(p, node)根据前继节点判断是否阻塞当前节点的线程
            // parkAndCheckInterrupt() 阻塞当前线程并检查线程是否被中断过
            // 如果被中断过，将interrupted置为true
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

共享模式下的acquireQueued，主要有几个不同：

1、doAcquireShared将线程的自我中断操作放在了方法体内部；

2、当线程获取到资源后，doAcquireShared会将当前线程所在的节点设为头结点，若资源有剩余则唤醒后序节点，比acquireQueue多了个唤醒后序节点的操作；

共享模式相当于 如果这个线程可以被唤醒并且还剩余有资源，那么就继续唤醒后面排列的其他线程。

**setHeadAndPropagate**函数：

```java
private void setHeadAndPropagate(Node node, int propagate) {
    Node h = head; // Record old head for check below
    setHead(node);
    /*
     * Try to signal next queued node if:
     *   Propagation was indicated by caller,
     *     or was recorded (as h.waitStatus either before
     *     or after setHead) by a previous operation
     *     (note: this uses sign-check of waitStatus because
     *      PROPAGATE status may transition to SIGNAL.)
     * and
     *   The next node is waiting in shared mode,
     *     or we don't know, because it appears null
     *
     * The conservatism in both of these checks may cause
     * unnecessary wake-ups, but only when there are multiple
     * racing acquires/releases, so most need signals now or soon
     * anyway.
     */
    if (propagate > 0 || h == null || h.waitStatus \< 0 ||
        (h = head) == null || h.waitStatus \< 0) {
        Node s = node.next;
        if (s == null || s.isShared())
            doReleaseShared();
    }
}
```

其实方法是**doReleaseShared**：

```java
private void doReleaseShared() {
    /*
     * Ensure that a release propagates, even if there are other
     * in-progress acquires/releases.  This proceeds in the usual
     * way of trying to unparkSuccessor of head if it needs
     * signal. But if it does not, status is set to PROPAGATE to
     * ensure that upon release, propagation continues.
     * Additionally, we must loop in case a new node is added
     * while we are doing this. Also, unlike other uses of
     * unparkSuccessor, we need to know if CAS to reset status
     * fails, if so rechecking.
     */
    for (;;) {
        Node h = head;
        if (h != null && h != tail) {
            int ws = h.waitStatus;
            if (ws == Node.SIGNAL) {
                if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
                    continue;            // loop to recheck cases
                unparkSuccessor(h);
            }
            else if (ws == 0 &&
                     !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))
                continue;                // loop on failed CAS
        }
        if (h == head)                   // loop if head changed
            break;
    }
}
```



#### 4、释放资源（共享模式）：

```java
public final boolean releaseShared(int arg) {
    //尝试释放资源
    if (tryReleaseShared(arg)) {
        //唤醒后继节点的线程
        doReleaseShared();
        return true;
    }
    return false;
}
```

同样 tryReleaseShared(arg) 是由继承AQS的自定义同步器来具体实现的。

AQS在独占和共享两种模式下，如何进行资源的获取和释放(tryAcquire-tryRelease、tryAcquireShared-tryReleaseShared)，需要注意的是，在acquire()和acquireShared()方法中，线程在阻塞过程中均是忽略中断的。

**实现了AQS的锁有：自旋锁、互斥锁、读锁写锁、条件产量、信号量、栅栏都是AQS的衍生物**

**AQS的核心思想**是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并将共享资源设置为锁定状态，如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制AQS是用CLH队列锁实现的，即将暂时获取不到锁的线程加入到队列中。
CLH（Craig，Landin，and Hagersten）队列是一个虚拟的双向队列，虚拟的双向队列即不存在队列实例，仅存在节点之间的关联关系。
**AQS是将每一条请求共享资源的线程封装成一个CLH锁队列的一个结点（Node），来实现锁的分配。**

用大白话来说，AQS就是基于CLH队列，用volatile修饰共享变量state，线程通过CAS去改变状态符，成功则获取锁成功，失败则进入等待队列，等待被唤醒。