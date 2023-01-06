<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<head>
				<title>RSS - Skateboardify</title>
				<meta charset="utf-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<meta name="description" content="Skateboardify - Stay up to date with us via RSS"/>
				<meta name="keywords" content="skateboardify, rss, feed, skateboard, longboard, electric, board, trucks, wheels, shop"/>
				<meta name="author" content="Nikola Simonović"/>
				<link rel="shortcut icon" href="images/icons/favicon.png" type="image/png"/>
				<link href='https://fonts.googleapis.com/css?family=Bangers' rel='stylesheet' type='text/css'/>
				<link href='https://fonts.googleapis.com/css?family=Oswald:400,300' rel='stylesheet' type='text/css'/>
				<link rel="stylesheet" type="text/css" href="css/main.css"/>
				<link rel="stylesheet" type="text/css" href="css/rss.css"/>
				<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
				<script src="js/main.js"></script>
				<script src="js/jquery.js"></script>
			</head>
			<body>
				<div class="wrapper">
					<div class="header">
						<div class="title">
							<h1>Skateboardify</h1>
							<span>Skateboard shop</span>
							<a href="index.html"><img src="images/logo.png" alt="Skateboardify logo" title="Skateboardify"/></a>
						</div>
						<ul class="nav">
							<li><a href="index.html">Home</a></li>
							<li><a href="#" class="hasdropdown">Skate</a>
								<ul>
									<li><a href="skateboards.html">Skateboards</a></li>
									<li><a href="longboards.html">Longboards</a></li>
									<li><a href="electricboards.html">Electric boards</a></li>
								</ul>
							</li>
							<li><a href="#" class="hasdropdown">Parts</a>
								<ul>
									<li><a href="wheels.html">Wheels</a></li>
									<li><a href="trucks.html">Trucks</a></li>
								</ul>
							</li>
							<li><a href="faq.html">FAQ</a></li>
							<li>
								<a href="#" class="hasdropdown">About</a>
								<ul>
									<li><a href="author.html">Author</a></li>
									<li><a href="contact.html">Contact us</a></li>
									<li><a href="documentation.pdf" target="_blank">Documentation</a></li>
								</ul>
							</li>
						</ul>
						<div class="right">
							<div class="loginInfo"><a href="#" id="login">Log in</a></div>
							<a href="#" id="logout" class="logout">Log out</a>
							<div id="loginForm" class="loginForm">
								<form id="formLogin" class="formLogin" action="#" method="GET">
									<label id="lbUsername" for="tbUsername">Username:</label>
									<input type="text" id="tbUsername"/>
									<label id="lbPassword" for="tbPassword">Password:</label>
									<input type="password" id="tbPassword"/>
									<input type="button" id="btnLogin" value="Log in"/>
									<a class="noaccount" href="register.html">Don't have an account?</a>
								</form>
							</div>
							<a href="#" class="search"><img src="images/icons/search.png" alt="Search icon" title="Search"/></a>
							<div id="searchForm" class="searchForm">
								<form id="formSearch" action="#" method="GET">
									<input type="text" name="search" id="tbSearch" value="Search..."/>
									<input type="button" id="btnSearch" value="FIND"/>
								</form>
							</div>
						</div>
					</div>
					<div class="main-wrap">
						<div class="main">
							<h2>RSS</h2>
							<ul>
								<xsl:for-each select="rss/channel">
									<li class="li-title">
										<a href="{link}"><xsl:value-of select="title"/></a>
										<li class="li-desc"><xsl:value-of select="description"/></li>
									</li>
								</xsl:for-each>
								<xsl:for-each select="rss/channel/item">
									<li class="li-title">
										<a href="{link}"><xsl:value-of select="title"/></a>
										<li class="li-desc"><xsl:value-of select="description"/></li>
									</li>
								</xsl:for-each>
							</ul>
						</div>
					</div>
					<div class="footer-wrap">
						<div class="footer">
							<div class="footer-left">
								<p>CONNECT</p>
								<ul class="socialmedia">
									<li><a href="#"><img src="images/icons/facebook.png" alt="Facebook" title="Facebook"/></a></li>
									<li><a href="#"><img src="images/icons/twitter.png" alt="Twitter" title="Twitter"/></a></li>
									<li><a href="#"><img src="images/icons/gplus.png" alt="Google plus" title="Google plus"/></a></li>
									<li><a href="#"><img src="images/icons/pinterest.png" alt="Pinterest" title="Pinterest"/></a></li>
									<li><a href="#"><img src="images/icons/youtube.png" alt="Youtube" title="Youtube"/></a></li>
									<li><a href="rss.xml"><img src="images/icons/rss.png" alt="RSS" title="RSS"/></a></li>
								</ul>
								<p>SUBSCRIBE TO OUR NEWSLETTER</p>
								<form action="#" method="GET" id="formEmail">
									<input type="text" id="tbEmail" class="tbEmail" value="Enter e-mail..."/>
									<input type="button" value="SUBSCRIBE" id="btnEmail" class="btnEmail"/>
								</form>
							</div>
							<div class="footer-right">
								<div class="footer-block">
									<p>SHOP</p>
									<ul>
										<li><a href="skateboards.html">Skateboards</a></li>
										<li><a href="longboards.html">Longboards</a></li>
										<li><a href="electricboards.html">Electric boards</a></li>
										<li><a href="wheels.html">Wheels</a></li>
										<li><a href="trucks.html">Trucks</a></li>
									</ul>
								</div>
								<div class="footer-block">
									<p>ABOUT</p>
									<ul>
										<li><a href="author.html">Author</a></li>
										<li><a href="documentation.pdf" target="_blank">Documentation</a></li>
										<li><a href="contact.html">Contact</a></li>
										<li><a href="faq.html">FAQ</a></li>
										<li><a href="rss.xml">RSS</a></li>
										<li><a href="sitemap.xml">Sitemap</a></li>
									</ul>
								</div>
								<div class="footer-block">
									<p>ACCOUNT</p>
									<ul>
										<li><a href="#" class="gotologin">Log in</a></li>
										<li><a href="register.html">Sign up</a></li>
									</ul>
									<a href="#" class="gototop" title="Go to top">&lt;</a>
								</div>
								<div class="clear"></div>
							</div>
							<div class="copyright"><p>Skateboardify | Made in 2016 | Images from <a href="http://www.tactics.com">tactics</a></p></div>
						</div>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>