<?php
  $wa_number = get_theme_mod( 'jc_whatsapp_number', '50600000000' );
  $wa_link   = 'https://wa.me/' . $wa_number . '?text=' . rawurlencode( 'Hola, quisiera agendar una valoración cardíaca' );
  $email     = get_theme_mod( 'jc_email', 'contacto@drjuliocascante.com' );
?>

<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <h4><?php bloginfo( 'name' ); ?></h4>
        <span class="role">Cardiología preventiva</span>
        <p style="margin-top:14px;font-size:14px;max-width:320px;">Valoración cardiovascular integral, orientada a la prevención y al seguimiento cercano de cada paciente.</p>
      </div>
      <div>
        <h4 style="font-size:14px;color:#B8C2CC;font-family:'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;">Navegación</h4>
        <div class="foot-links">
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#servicios">Servicios</a>
          <a href="#galeria">Consulta</a>
          <a href="#contacto">Contacto</a>
        </div>
      </div>
      <div>
        <h4 style="font-size:14px;color:#B8C2CC;font-family:'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;">Contacto directo</h4>
        <div class="foot-links">
          <a href="<?php echo esc_url( $wa_link ); ?>" target="_blank" rel="noopener">WhatsApp</a>
          <a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a>
          <a href="<?php echo esc_url( home_url( '/' ) ); ?>">[www.drjuliocascante.com](https://www.drjuliocascante.com)</a>
        </div>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <span id="year"></span> <?php bloginfo( 'name' ); ?>. Todos los derechos reservados.</span>
      <span>Este sitio no sustituye una consulta médica presencial.</span>
    </div>
  </div>
</footer>

<a href="<?php echo esc_url( $wa_link ); ?>" target="_blank" rel="noopener" class="wa-float" aria-label="Contactar por WhatsApp">
  <div class="wa-pulse"></div>
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.2-1.36a9.9 9.9 0 004.84 1.23h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.1c-.24.68-1.4 1.3-1.93 1.37-.5.08-1.12.11-1.8-.11-.42-.13-.95-.3-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.17-1.56-1.17-2.97 0-1.41.74-2.1 1-2.39.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.38-.23.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z"/></svg>
</a>

<?php wp_footer(); ?>
</body>
</html>
