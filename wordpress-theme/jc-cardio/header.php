<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Dr. Julio Cascante · Cardiología preventiva. Electrocardiograma, ecocardiograma, ergometría, Holter, MAPA y consulta prequirúrgica. Agenda tu valoración cardíaca.">
<meta name="theme-color" content="#0B1F33">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
  $wa_number = get_theme_mod( 'jc_whatsapp_number', '50600000000' );
  $wa_link   = 'https://wa.me/' . $wa_number . '?text=' . rawurlencode( 'Hola, quisiera agendar una valoración cardíaca' );
?>

<header id="siteHeader">
  <div class="nav">
    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="brand">
      <span class="name"><?php bloginfo( 'name' ); ?></span>
      <span class="role">Cardiología Preventiva</span>
    </a>
    <nav class="nav-links">
      <a href="#sobre-mi">Sobre mí</a>
      <a href="#servicios">Servicios</a>
      <a href="#galeria">Consulta</a>
      <a href="#contacto">Contacto</a>
    </nav>
    <div class="nav-cta">
      <a href="#contacto" class="btn btn-ghost">Agendar cita</a>
      <a href="<?php echo esc_url( $wa_link ); ?>" target="_blank" rel="noopener" class="btn btn-wa">WhatsApp</a>
      <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="mobile-panel" id="mobilePanel">
    <a href="#sobre-mi">Sobre mí</a>
    <a href="#servicios">Servicios</a>
    <a href="#galeria">Consulta</a>
    <a href="#contacto">Contacto</a>
  </div>
</header>
