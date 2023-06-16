import{_ as o,o as e,c as s,O as a}from"./chunks/framework.6d2956c6.js";const n="/you-dont-know-js/assets/fig1.940979f3.png",A=JSON.parse('{"title":"第一章：什么是作用域？","description":"","frontmatter":{},"headers":[],"relativePath":"scope&closures/ch1.md","filePath":"scope&closures/ch1.md"}'),p={name:"scope&closures/ch1.md"},l=a(`<h1 id="第一章-什么是作用域" tabindex="-1">第一章：什么是作用域？ <a class="header-anchor" href="#第一章-什么是作用域" aria-label="Permalink to &quot;第一章：什么是作用域？&quot;">​</a></h1><p>几乎所有语言的最基础模型之一就是在变量中存储值，并且在稍后取出或修改这些值的能力。事实上，在变量中存储值和取出值的能力，给程序赋予了 <em>状态</em>。</p><p>如果没有这样的概念，一个程序虽然可以执行一些任务，但是它们将会受到极大的限制而且不会非常有趣。</p><p>但是在我们的程序中纳入变量，引出了我们现在将要解决的最有趣的问题：这些变量 <em>存活</em> 在哪里？换句话说，它们被存储在哪儿？而且，最重要的是，我们的程序如何在需要它们的时候找到它们？</p><p>回答这些问题需要一组明确定义的规则，它定义如何在某些位置存储变量，以及如何在稍后找到这些变量。我们称这组规则为：<em>作用域</em>。</p><p>但是，这些 <em>作用域</em> 规则是在哪里、如何被设置的？</p><h2 id="编译器理论" tabindex="-1">编译器理论 <a class="header-anchor" href="#编译器理论" aria-label="Permalink to &quot;编译器理论&quot;">​</a></h2><p>根据你与各种编程语言打交道的水平不同，这也许是不证自明的，或者这也许令人吃惊，尽管 JavaScript 一般被划分到“动态”或者“解释型”语言的范畴，但是其实它是一个编译型语言。它 <em>不是</em> 像许多传统意义上的编译型语言那样预先被编译好，编译的结果也不能在各种不同的分布式系统间移植。</p><p>但是无论如何，JavaScript 引擎在实施许多与传统的语言编译器相同的步骤，虽然是以一种我们不易察觉的更精巧的方式。</p><p>在传统的编译型语言处理中，一块儿源代码，你的程序，在它被执行 <em>之前</em> 通常将会经历三个步骤，大致被称为“编译”：</p><ol><li><p><strong>分词/词法分析：</strong> 将一连串字符打断成（对于语言来说）有意义的片段，称为 token（记号）。举例来说，考虑这段程序：<code>var a = 2;</code>。这段程序很可能会被打断成如下 token：<code>var</code>，<code>a</code>，<code>=</code>，<code>2</code>，和 <code>;</code>。空格也许会被保留为一个 token，这要看它是否是有意义的。</p><p><strong>注意：</strong> 分词和词法分析之间的区别是微妙和学术上的，其中心在于这些 token 是否以 <em>无状态</em> 或 <em>有状态</em> 的方式被识别。简而言之，如果分词器去调用有状态的解析规则来弄清<code>a</code>是否应当被考虑为一个不同的 token，还是只是其他 token 的一部分，那么这就是 <strong>词法分析</strong>。</p></li><li><p><strong>解析：</strong> 将一个 token 的流（数组）转换为一个嵌套元素的树，它综合地表示了程序的语法结构。这棵树称为“抽象语法树”（AST —— <b>A</b>bstract <b>S</b>yntax <b>T</b>ree）。</p><p><code>var a = 2;</code> 的树也许开始于称为 <code>VariableDeclaration</code>（变量声明）顶层节点，带有一个称为 <code>Identifier</code>（标识符）的子节点（它的值为 <code>a</code>），和另一个称为 <code>AssignmentExpression</code>（赋值表达式）的子节点，而这个子节点本身带有一个称为 <code>NumericLiteral</code>（数字字面量）的子节点（它的值为<code>2</code>）。</p></li><li><p><strong>代码生成：</strong> 这个处理将抽象语法树转换为可执行的代码。这一部分将根据语言，它的目标平台等因素有很大的不同。</p><p>所以，与其深陷细节，我们不如笼统地说，有一种方法将我们上面描述的 <code>var a = 2;</code> 的抽象语法树转换为机器指令，来实际上 <em>创建</em> 一个称为 <code>a</code> 的变量（包括分配内存等等），然后在 <code>a</code> 中存入一个值。</p><p><strong>注意：</strong> 引擎如何管理系统资源的细节远比我们要挖掘的东西深刻，所以我们将理所当然地认为引擎有能力按其需要创建和存储变量。</p></li></ol><p>和大多数其他语言的编译器一样，JavaScript 引擎要比这区区三步复杂太多了。例如，在解析和代码生成的处理中，一定会存在优化执行效率的步骤，包括压缩冗余元素，等等。</p><p>所以，我在此描绘的只是大框架。但是我想你很快就会明白为什么我们涵盖的这些细节是重要的，虽然是在很高的层次上。</p><p>其一，JavaScript 引擎没有（像其他语言的编译器那样）大把的时间去优化，因为 JavaScript 的编译和其他语言不同，不是提前发生在一个构建的步骤中。</p><p>对 JavaScript 来说，在许多情况下，编译发生在代码被执行前的仅仅几微秒之内（或更少！）。为了确保最快的性能，JS 引擎将使用所有的招数（比如 JIT，它可以懒编译甚至是热编译，等等），而这远超出了我们关于“作用域”的讨论。</p><p>为了简单起见，我们可以说，任何 JavaScript 代码段在它执行之前（通常是 <em>刚好</em> 在它执行之前！）都必须被编译。所以，JS 编译器将把程序 <code>var a = 2;</code> 拿过来，并首先编译它，然后准备运行它，通常是立即的。</p><h2 id="理解作用域" tabindex="-1">理解作用域 <a class="header-anchor" href="#理解作用域" aria-label="Permalink to &quot;理解作用域&quot;">​</a></h2><p>我们将采用的学习作用域的方法，是将这个处理过程想象为一场对话。但是，<em>谁</em> 在进行这场对话呢？</p><h3 id="演员" tabindex="-1">演员 <a class="header-anchor" href="#演员" aria-label="Permalink to &quot;演员&quot;">​</a></h3><p>让我们见一见处理程序 <code>var a = 2;</code> 时进行互动的演员吧，这样我们就能理解稍后将要听到的它们的对话：</p><ol><li><p><em>引擎</em>：负责从始至终的编译和执行我们的 JavaScript 程序。</p></li><li><p><em>编译器</em>：<em>引擎</em> 的朋友之一；处理所有的解析和代码生成的重活儿（见前一节）。</p></li><li><p><em>作用域</em>：<em>引擎</em> 的另一个朋友；收集并维护一张所有被声明的标识符（变量）的列表，并对当前执行中的代码如何访问这些变量强制实施一组严格的规则。</p></li></ol><p>为了 <em>全面理解</em> JavaScript 是如何工作的，你需要开始像 <em>引擎</em>（和它的朋友们）那样 <em>思考</em>，问它们问的问题，并像它们一样回答。</p><h3 id="反复" tabindex="-1">反复 <a class="header-anchor" href="#反复" aria-label="Permalink to &quot;反复&quot;">​</a></h3><p>当你看到程序 <code>var a = 2;</code> 时，你很可能认为它是一个语句。但这不是我们的新朋友 <em>引擎</em> 所看到的。事实上，<em>引擎</em> 看到两个不同的语句，一个是 <em>编译器</em> 将在编译期间处理的，一个是 <em>引擎</em> 将在执行期间处理的。</p><p>那么，让我们来分析 <em>引擎</em> 和它的朋友们将如何处理程序 <code>var a = 2;</code>。</p><p><em>编译器</em> 将对这个程序做的第一件事情，是进行词法分析来将它分解为一系列 token，然后这些 token 被解析为一棵树。但是当 <em>编译器</em> 到了代码生成阶段时，它会以一种与我们可能想象的不同的方式来对待这段程序。</p><p>一个合理的假设是，<em>编译器</em> 将产生的代码可以用这种假想代码概括：“为一个变量分配内存，将它标记为 <code>a</code>，然后将值 <code>2</code> 贴在这个变量里”。不幸的是，这不是十分准确。</p><p><em>编译器</em> 将会这样处理：</p><ol><li><p>遇到 <code>var a</code>，<em>编译器</em> 让 <em>作用域</em> 去查看对于这个特定的作用域集合，变量 <code>a</code> 是否已经存在了。如果是，<em>编译器</em> 就忽略这个声明并继续前进。否则，<em>编译器</em> 就让 <em>作用域</em> 去为这个作用域集合声明一个称为 <code>a</code> 的新变量。</p></li><li><p>然后 <em>编译器</em> 为 <em>引擎</em> 生成稍后要执行的代码，来处理赋值 <code>a = 2</code>。<em>引擎</em> 运行的代码首先让 <em>作用域</em> 去查看在当前的作用域集合中是否有一个称为 <code>a</code> 的变量可以访问。如果有，<em>引擎</em> 就使用这个变量。如果没有，<em>引擎</em> 就查看 <em>其他地方</em>（参见下面的嵌套 <em>作用域</em> 一节）。</p></li></ol><p>如果 <em>引擎</em> 最终找到一个变量，它就将值 <code>2</code> 赋予它。如果没有，<em>引擎</em> 将会举起它的手并喊出一个错误！</p><p>总结来说：对于一个变量赋值，发生了两个不同的动作：第一，<em>编译器</em> 声明一个变量（如果先前没有在当前作用域中声明过），第二，当执行时，<em>引擎</em> 在 <em>作用域</em> 中查询这个变量并给它赋值，如果找到的话。</p><h3 id="编译器术语" tabindex="-1">编译器术语 <a class="header-anchor" href="#编译器术语" aria-label="Permalink to &quot;编译器术语&quot;">​</a></h3><p>为了继续更深入地理解，我们需要一点儿更多的编译器术语。</p><p>当 <em>引擎</em> 执行 <em>编译器</em> 在第二步为它产生的代码时，它必须查询变量 <code>a</code> 来看它是否已经被声明过了，而且这个查询是咨询 <em>作用域</em> 的。但是 <em>引擎</em> 所实施的查询的类型会影响查询的结果。</p><p>在我们这个例子中，<em>引擎</em> 将会对变量 <code>a</code> 实施一个“LHS”查询。另一种类型的查询称为“RHS”。</p><p>我打赌你能猜出“L”和“R”是什么意思。这两个术语表示“Left-hand Side（左手边）”和“Right-hand Side（右手边）”</p><p>什么的……边？<strong>赋值操作的。</strong></p><p>换言之，当一个变量出现在赋值操作的左手边时，会进行 LHS 查询，当一个变量出现在赋值操作的右手边时，会进行 RHS 查询。</p><p>实际上，我们可以表述得更准确一点儿。对于我们的目的来说，一个 RHS 是难以察觉的，因为它简单地查询某个变量的值，而 LHS 查询是试着找到变量容器本身，以便它可以赋值。从这种意义上说，RHS 的含义实质上不是 <em>真正的</em> “一个赋值的右手边”，更准确地说，它只是意味着“不是左手边”。</p><p>在这一番油腔滑调之后，你也可以认为“RHS”意味着“取得他/她的源（值）”，暗示着 RHS 的意思是“去取……的值”。</p><p>让我们挖掘得更深一些。</p><p>当我说：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">( a )</span><span style="color:#89DDFF;">;</span></span></code></pre></div><p>这个指向 <code>a</code> 的引用是一个 RHS 引用，因为这里没有东西被赋值给 <code>a</code>。而是我们在查询 <code>a</code> 并取得它的值，这样这个值可以被传递进 <code>console.log(..)</code>。</p><p>作为对比：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">a </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">;</span></span></code></pre></div><p>这里指向 <code>a</code> 的引用是一个 LHS 引用，因为我们实际上不关心当前的值是什么，我们只是想找到这个变量，将它作为 <code>= 2</code> 赋值操作的目标。</p><p><strong>注意：</strong> LHS 和 RHS 意味着“赋值的左/右手边”未必像字面上那样意味着“ <code>=</code> 赋值操作符的左/右边”。赋值有几种其他的发生形式，所以最好在概念上将它考虑为：“赋值的目标（LHS）”和“赋值的源（RHS）”。</p><p>考虑这段程序，它既有 LHS 引用又有 RHS 引用：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">foo</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">a</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">( </span><span style="color:#A6ACCD;">a</span><span style="color:#F07178;"> )</span><span style="color:#89DDFF;">;</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 2</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">foo</span><span style="color:#A6ACCD;">( </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> )</span><span style="color:#89DDFF;">;</span></span></code></pre></div><p>调用 <code>foo(..)</code> 的最后一行作为一个函数调用要求一个指向 <code>foo</code> 的 RHS 引用，意味着，“去查询 <code>foo</code> 的值，并把它交给我”。另外，<code>(..)</code> 意味着 <code>foo</code> 的值应当被执行，所以它最好实际上是一个函数！</p><p>这里有一个微妙但重要的赋值。<strong>你发现了吗？</strong></p><p>你可能错过了这个代码段隐含的 <code>a = 2</code>。它发生在当值 <code>2</code> 作为参数值传递给 <code>foo(..)</code> 函数时，值 <code>2</code> <strong>被赋值</strong> 给了参数 <code>a</code>。为了（隐含地）给参数 <code>a</code> 赋值，进行了一个 LHS 查询。</p><p>这里还有一个 <code>a</code> 的值的 RHS 引用，它的结果值被传入 <code>console.log(..)</code>。<code>console.log(..)</code> 需要一个引用来执行。它为 <code>console</code> 对象进行一个 RHS 查询，然后发生一个属性解析来看它是否拥有一个称为 <code>log</code> 的方法。</p><p>最后，我们可以将这一过程概念化为，在将值 <code>2</code>（通过变量 <code>a</code> 的 RHS 查询得到的）传入 <code>log(..)</code> 时发生了一次 LHS/RHS 的交换。在 <code>log(..)</code> 的原生实现内部，我们可以假定它拥有参数，其中的第一个（也许被称为 <code>arg1</code>）在 <code>2</code> 被赋值给它之前，进行了一次 LHS 引用查询。</p><p><strong>注意：</strong> 你可能会试图将函数声明 <code>function foo(a) {...</code> 概念化为一个普通的变量声明和赋值，比如 <code>var foo</code> 和 <code>foo = function(a){...</code>。这样做会诱使你认为函数声明涉及了一次 LHS 查询。</p><p>然而，一个微妙但重要的不同是，在这种情况下 <em>编译器</em> 在代码生成期间同时处理声明和值的定义，如此当 <em>引擎</em> 执行代码时，没有必要将一个函数值“赋予” <code>foo</code>。因此，将函数声明考虑为一个我们在这里讨论的 LHS 查询赋值是不太合适的。</p><h3 id="引擎-作用域对话" tabindex="-1">引擎/作用域对话 <a class="header-anchor" href="#引擎-作用域对话" aria-label="Permalink to &quot;引擎/作用域对话&quot;">​</a></h3><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">foo</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">a</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">( </span><span style="color:#A6ACCD;">a</span><span style="color:#F07178;"> )</span><span style="color:#89DDFF;">;</span><span style="color:#F07178;"> </span><span style="color:#676E95;font-style:italic;">// 2</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">foo</span><span style="color:#A6ACCD;">( </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> )</span><span style="color:#89DDFF;">;</span></span></code></pre></div><p>让我们将上面的（处理这个代码段的）交互想象为一场对话。这场对话将会有点儿像这样进行：</p><blockquote><p><em><strong>引擎</strong></em>：嘿 <em>作用域</em>，我有一个 <code>foo</code> 的 RHS 引用。听说过它吗？</p></blockquote><blockquote><p><em><strong>作用域</strong></em>；啊，是的，听说过。<em>编译器</em> 刚在一秒钟之前声明了它。它是一个函数。给你。</p></blockquote><blockquote><p><em><strong>引擎</strong></em>：太棒了，谢谢！好的，我要执行 <code>foo</code> 了。</p></blockquote><blockquote><p><em><strong>引擎</strong></em>：嘿，<em>作用域</em>，我得到了一个 <code>a</code> 的 LHS 引用，听说过它吗？</p></blockquote><blockquote><p><em><strong>作用域</strong></em>：啊，是的，听说过。<em>编译器</em> 刚才将它声明为 <code>foo</code> 的一个正式参数了。给你。</p></blockquote><blockquote><p><em><strong>引擎</strong></em>：一如既往的给力，<em>作用域</em>。再次感谢你。现在，该把 <code>2</code> 赋值给 <code>a</code> 了。</p></blockquote><blockquote><p><em><strong>引擎</strong></em>：嘿，<em>作用域</em>，很抱歉又一次打扰你。我需要 RHS 查询 <code>console</code>。听说过它吗？</p></blockquote><blockquote><p><em><strong>作用域</strong></em>：没关系，<em>引擎</em>，这是我一天到晚的工作。是的，我得到 <code>console</code> 了。它是一个内建对象。给你。</p></blockquote><blockquote><p><em><strong>引擎</strong></em>：完美。查找 <code>log(..)</code>。好的，很好，它是一个函数。</p></blockquote><blockquote><p><em><strong>引擎</strong></em>：嘿，<em>作用域</em>。你能帮我查一下 <code>a</code> 的 RHS 引用吗？我想我记得它，但只是想再次确认一下。</p></blockquote><blockquote><p><em><strong>作用域</strong></em>：你是对的，<em>引擎</em>。同一个家伙，没变。给你。</p></blockquote><blockquote><p><em><strong>引擎</strong></em>：酷。传递 <code>a</code> 的值，也就是 <code>2</code>，给 <code>log(..)</code>。</p></blockquote><blockquote><p>...</p></blockquote><h3 id="小测验" tabindex="-1">小测验 <a class="header-anchor" href="#小测验" aria-label="Permalink to &quot;小测验&quot;">​</a></h3><p>检查你到目前为止的理解。确保你扮演 <em>引擎</em>，并与 <em>作用域</em> “对话”：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">foo</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">a</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">b</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">a</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">a</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">b</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">var</span><span style="color:#A6ACCD;"> c </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">foo</span><span style="color:#A6ACCD;">( </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> )</span><span style="color:#89DDFF;">;</span></span></code></pre></div><ol><li><p>找到所有的 LHS 查询（有3处！）。</p></li><li><p>找到所有的 RHS 查询（有4处！）。</p></li></ol><p><strong>注意：</strong> 小测验答案参见本章的复习部分！</p><h2 id="嵌套的作用域" tabindex="-1">嵌套的作用域 <a class="header-anchor" href="#嵌套的作用域" aria-label="Permalink to &quot;嵌套的作用域&quot;">​</a></h2><p>我们说过 <em>作用域</em> 是通过标识符名称查询变量的一组规则。但是，通常会有多于一个的 <em>作用域</em> 需要考虑。</p><p>就像一个代码块儿或函数被嵌套在另一个代码块儿或函数中一样，作用域被嵌套在其他的作用域中。所以，如果在直接作用域中找不到一个变量的话，<em>引擎</em> 就会咨询下一个外层作用域，如此继续直到找到这个变量或者到达最外层作用域（也就是全局作用域）。</p><p>考虑这段代码：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">foo</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">a</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">( </span><span style="color:#A6ACCD;">a</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">b</span><span style="color:#F07178;"> )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">var</span><span style="color:#A6ACCD;"> b </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">foo</span><span style="color:#A6ACCD;">( </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> )</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 4</span></span></code></pre></div><p><code>b</code> 的 RHS 引用不能在函数 <code>foo</code> 的内部被解析，但是可以在它的外围 <em>作用域</em>（这个例子中是全局作用域）中解析。</p><p>所以，重返 <em>引擎</em> 和 <em>作用域</em> 的对话，我们会听到：</p><blockquote><p><em><strong>引擎</strong></em>：“嘿，<code>foo</code> 的 <em>作用域</em>，听说过 <code>b</code> 吗？我得到一个它的 RHS 引用。”</p></blockquote><blockquote><p><em><strong>作用域</strong></em>：“没有，从没听说过。问问别人吧。”</p></blockquote><blockquote><p><em><strong>引擎</strong></em>：“嘿，<code>foo</code> 外面的 <em>作用域</em>，哦，你是全局 <em>作用域</em>，好吧，酷。听说过 <code>b</code> 吗？我得到一个它的 RHS 引用。”</p></blockquote><blockquote><p><em><strong>作用域</strong></em>：“是的，当然有。给你。”</p></blockquote><p>遍历嵌套 <em>作用域</em> 的简单规则：<em>引擎</em> 从当前执行的 <em>作用域</em> 开始，在那里查找变量，如果没有找到，就向上走一级继续查找，如此类推。如果到了最外层的全局作用域，那么查找就会停止，无论它是否找到了变量。</p><h3 id="建筑的隐喻" tabindex="-1">建筑的隐喻 <a class="header-anchor" href="#建筑的隐喻" aria-label="Permalink to &quot;建筑的隐喻&quot;">​</a></h3><p>为了将嵌套 <em>作用域</em> 解析的过程可视化，我想让你考虑一下这个高层建筑。</p><img src="`+n+`" width="250"><p>这个建筑物表示我们程序的嵌套 <em>作用域</em> 规则集合。无论你在哪里，建筑的第一层表示你当前执行的 <em>作用域</em>。建筑的顶层表示全局 <em>作用域</em>。</p><p>你通过在你当前的楼层中查找来解析 LHS 和 RHS 引用，如果你没有找到它，就坐电梯到上一层楼，在那里寻找，然后再上一层，如此类推。一旦你到了顶层（全局 <em>作用域</em>），你要么找到了你想要的东西，要么没有。但是不管怎样你都不得不停止了。</p><h2 id="错误" tabindex="-1">错误 <a class="header-anchor" href="#错误" aria-label="Permalink to &quot;错误&quot;">​</a></h2><p>为什么我们区别 LHS 和 RHS 那么重要？</p><p>因为在变量还没有被声明（在所有被查询的 <em>作用域</em> 中都没找到）的情况下，这两种类型的查询的行为不同。</p><p>考虑如下代码：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">foo</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">a</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">( </span><span style="color:#A6ACCD;">a</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">b</span><span style="color:#F07178;"> )</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#A6ACCD;">b</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">a</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">foo</span><span style="color:#A6ACCD;">( </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> )</span><span style="color:#89DDFF;">;</span></span></code></pre></div><p>当 <code>b</code> 的 RHS 查询第一次发生时，它是找不到的。它被说成是一个“未声明”的变量，因为它在作用域中找不到。</p><p>如果 RHS 查询在嵌套的 <em>作用域</em> 的任何地方都找不到一个值，这会导致 <em>引擎</em> 抛出一个 <code>ReferenceError</code>。必须要注意的是这个错误的类型是 <code>ReferenceError</code>。</p><p>相比之下，如果 <em>引擎</em> 在进行一个 LHS 查询，但到达了顶层（全局 <em>作用域</em>）都没有找到它，而且如果程序没有运行在“Strict模式”[^note-strictmode]下，那么这个全局 <em>作用域</em> 将会在 <strong>全局作用域中</strong> 创建一个同名的新变量，并把它交还给 <em>引擎</em>。</p><p><em>“不，之前没有这样的东西，但是我可以帮忙给你创建一个。”</em></p><p>在 ES5 中被加入的“Strict模式”[^note-strictmode]，有许多与一般/宽松/懒惰模式不同的行为。其中之一就是不允许自动/隐含的全局变量创建。在这种情况下，将不会有全局 <em>作用域</em> 的变量交回给 LHS 查询，并且类似于 RHS 的情况, <em>引擎</em> 将抛出一个 <code>ReferenceError</code>。</p><p>现在，如果一个 RHS 查询的变量被找到了，但是你试着去做一些这个值不可能做到的事，比如将一个非函数的值作为函数运行，或者引用 <code>null</code> 或者 <code>undefined</code> 值的属性，那么 <em>引擎</em> 就会抛出一个不同种类的错误，称为 <code>TypeError</code>。</p><p><code>ReferenceError</code> 是关于 <em>作用域</em> 解析失败的，而 <code>TypeError</code> 暗示着 <em>作用域</em> 解析成功了，但是试图对这个结果进行了一个非法/不可能的动作。</p><h2 id="复习" tabindex="-1">复习 <a class="header-anchor" href="#复习" aria-label="Permalink to &quot;复习&quot;">​</a></h2><p>作用域是一组规则，它决定了一个变量（标识符）在哪里和如何被查找。这种查询也许是为了向这个变量赋值，这时变量是一个 LHS（左手边）引用，或者是为取得它的值，这时变量是一个 RHS（右手边）引用。</p><p>LHS 引用得自赋值操作。<em>作用域</em> 相关的赋值可以通过 <code>=</code> 操作符发生，也可以通过向函数参数传递（赋予）参数值发生。</p><p>JavaScript <em>引擎</em> 在执行代码之前首先会编译它，因此，它将 <code>var a = 2;</code> 这样的语句分割为两个分离的步骤：</p><ol><li><p>首先，<code>var a</code> 在当前 <em>作用域</em> 中声明。这是在最开始，代码执行之前实施的。</p></li><li><p>稍后，<code>a = 2</code> 查找这个变量（LHS 引用），并且如果找到就向它赋值。</p></li></ol><p>LHS 和 RHS 引用查询都从当前执行中的 <em>作用域</em> 开始，如果有需要（也就是，它们在这里没能找到它们要找的东西），它们会在嵌套的 <em>作用域</em> 中一路向上，一次一个作用域（层）地查找这个标识符，直到它们到达全局作用域（顶层）并停止，既可能找到也可能没找到。</p><p>未被满足的 RHS 引用会导致 <code>ReferenceError</code> 被抛出。未被满足的 LHS 引用会导致一个自动的，隐含地创建的同名全局变量（如果不是“Strict模式”[^note-strictmode]），或者一个 <code>ReferenceError</code>（如果是“Strict模式”[^note-strictmode]）。</p><h3 id="小测验答案" tabindex="-1">小测验答案 <a class="header-anchor" href="#小测验答案" aria-label="Permalink to &quot;小测验答案&quot;">​</a></h3><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">foo</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">a</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#C792EA;">var</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">b</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">a</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">a</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">b</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">var</span><span style="color:#A6ACCD;"> c </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">foo</span><span style="color:#A6ACCD;">( </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;"> )</span><span style="color:#89DDFF;">;</span></span></code></pre></div><ol><li><p>找出所有的 LHS 查询（有3处！）。</p><p><strong><code>c = ..</code>, <code>a = 2</code>（隐含的参数赋值）和 <code>b = ..</code></strong></p></li><li><p>找出所有的 RHS 查询（有4处！）。</p><p><strong><code>foo(2..</code>, <code>= a;</code>, <code>a + ..</code> 和 <code>.. + b</code></strong></p></li></ol><p>[^note-strictmode]: MDN: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode" target="_blank" rel="noreferrer">Strict Mode</a></p>`,118),c=[l];function t(r,d,m,i,y,F){return e(),s("div",null,c)}const C=o(p,[["render",t]]);export{A as __pageData,C as default};
