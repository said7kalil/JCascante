<?php get_header(); ?>

<?php
  $wa_number = get_theme_mod( 'jc_whatsapp_number', '50600000000' );
  $wa_base   = 'https://wa.me/' . $wa_number . '?text=';
  $phone     = get_theme_mod( 'jc_phone_display', '+506 0000-0000' );
  $email     = get_theme_mod( 'jc_email', 'contacto@drjuliocascante.com' );
  $address   = get_theme_mod( 'jc_address', '[ Dirección — completar ]' );
  $hours     = get_theme_mod( 'jc_hours', '[ Días y horas — completar ]' );
  $img       = get_template_directory_uri() . '/images/';
?>

<section class="hero" id="inicio">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <span class="eyebrow">Cardiología preventiva</span>
        <h1>Cuidar el corazón <em>antes</em><br>de que dé señales</h1>
        <p class="lead">Valoración cardiovascular integral enfocada en detectar a tiempo lo que un chequeo general no siempre revela. Prevención real, con seguimiento cercano.</p>
        <div class="hero-actions">
          <a href="<?php echo esc_url( $wa_base . rawurlencode('Hola, quisiera agendar una valoración cardíaca') ); ?>" target="_blank" rel="noopener" class="btn btn-primary">Agendar valoración</a>
          <a href="#servicios" class="btn btn-ghost">Ver servicios</a>
        </div>
        <div class="stat-row">
          <div class="stat"><div class="label">Enfoque</div><div class="val">Prevención integral</div></div>
          <div class="stat"><div class="label">Diagnóstico</div><div class="val">Equipo especializado</div></div>
          <div class="stat"><div class="label">Atención</div><div class="val">Personalizada</div></div>
        </div>
      </div>
      <div class="hero-figure">
        <div class="ekg-track">
          <svg viewBox="0 0 400 64" preserveAspectRatio="none">
            <path class="ekg-path" d="M0,32 L60,32 L75,32 L85,10 L95,54 L105,32 L140,32 L155,32 L165,18 L175,46 L185,32 L400,32"/>
          </svg>
        </div>
        <img src="<?php echo esc_url( $img . 'dr-julio-hero.png' ); ?>" alt="Dr. Julio Cascante, cardiólogo">
      </div>
    </div>
  </div>
</section>

<div class="divider"><svg viewBox="0 0 1200 40" preserveAspectRatio="none"><path d="M0,20 L1200,20"/></svg></div>

<section class="about" id="sobre-mi">
  <div class="wrap">
    <div class="about-grid">
      <img class="about-photo reveal" src="<?php echo esc_url( $img . 'consulta-3.jpg' ); ?>" alt="Dr. Julio Cascante en consulta">
      <div class="reveal">
        <span class="eyebrow">Sobre mí</span>
        <h2>Un enfoque centrado en prevenir, no solo en tratar</h2>
        <p>Mi trabajo como cardiólogo está orientado a identificar factores de riesgo cardiovascular antes de que se conviertan en un problema mayor. Cada consulta combina una evaluación clínica detallada con estudios diagnósticos precisos, para que usted entienda con claridad el estado de su corazón y los pasos a seguir.</p>
        <p>Trabajo de cerca con cada paciente, explicando cada estudio y resultado en un lenguaje claro, sin tecnicismos innecesarios.</p>
        <ul class="credentials">
          <li><span>Especialidad</span><span>[ Cardiología — completar ]</span></li>
          <li><span>Formación</span><span>[ Universidad / hospital — completar ]</span></li>
          <li><span>Colegiado</span><span>[ Número de colegiatura ]</span></li>
          <li><span>Idiomas</span><span>Español</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="servicios" style="background:var(--paper);">
  <div class="wrap">
    <div class="services-head reveal">
      <span class="eyebrow">Servicios</span>
      <h2>Estudios y consultas para conocer su corazón a fondo</h2>
      <p>Cada estudio aporta una pieza distinta del panorama cardiovascular. Juntos, permiten una valoración preventiva completa.</p>
    </div>
    <div class="services-grid">
      <?php
      $services = array(
        array( 'Electrocardiograma', 'Registro de la actividad eléctrica del corazón para detectar arritmias y otras alteraciones del ritmo cardíaco.', '<path d="M2 12h4l2-7 4 14 3-10 2 3h5"/>' ),
        array( 'Ecocardiograma', 'Ultrasonido del corazón que evalúa su estructura, válvulas y capacidad de bombeo en tiempo real.', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>' ),
        array( 'Ergometría', 'Prueba de esfuerzo que mide la respuesta cardiovascular durante la actividad física controlada.', '<path d="M4 20c2-6 4-9 5-9s2 5 3 5 2-9 3-9 1 4 2 4h3"/>' ),
        array( 'Holter', 'Monitoreo continuo del ritmo cardíaco durante 24 horas para detectar arritmias intermitentes.', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>' ),
        array( 'MAPA', 'Monitoreo ambulatorio de la presión arterial durante 24 horas en las actividades cotidianas.', '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>' ),
        array( 'Consulta prequirúrgica', 'Valoración cardiológica previa a una cirugía, para evaluar el riesgo y dar el aval correspondiente.', '<path d="M9 3h6l1 3H8l1-3z"/><rect x="6" y="6" width="12" height="15" rx="1"/><path d="M9 12l2 2 4-4"/>' ),
      );
      foreach ( $services as $s ) :
        $wa_link = $wa_base . rawurlencode( 'Quisiera agendar: ' . $s[0] );
      ?>
      <div class="service-card reveal">
        <div class="service-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><?php echo $s[2]; ?></svg>
        </div>
        <h3><?php echo esc_html( $s[0] ); ?></h3>
        <p><?php echo esc_html( $s[1] ); ?></p>
        <a class="service-link" href="<?php echo esc_url( $wa_link ); ?>" target="_blank" rel="noopener">Agendar →</a>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="gallery" id="galeria">
  <div class="wrap">
    <span class="eyebrow">En consulta</span>
    <h2 class="reveal">Un acompañamiento cercano, en cada estudio y cada visita</h2>
    <div class="gallery-grid">
      <div class="gallery-item reveal">
        <img src="<?php echo esc_url( $img . 'consulta-1.jpg' ); ?>" alt="Toma de presión arterial en consulta">
        <div class="gallery-cap">Control de presión arterial</div>
      </div>
      <div class="gallery-item reveal">
        <img src="<?php echo esc_url( $img . 'consulta-2.jpg' ); ?>" alt="Consulta y valoración cardiológica">
        <div class="gallery-cap">Consulta y valoración</div>
      </div>
      <div class="gallery-item reveal">
        <img src="<?php echo esc_url( $img . 'consulta-3.jpg' ); ?>" alt="Seguimiento personalizado al paciente">
        <div class="gallery-cap">Seguimiento personalizado</div>
      </div>
    </div>
  </div>
</section>

<div class="cta-banner">
  <div class="wrap">
    <span class="eyebrow">Prevención</span>
    <h2>La mejor cirugía es la que nunca se necesita</h2>
    <a href="<?php echo esc_url( $wa_base . rawurlencode('Hola, quisiera agendar una valoración cardíaca') ); ?>" target="_blank" rel="noopener" class="btn btn-primary">Agendar mi valoración</a>
  </div>
</div>

<section class="contact" id="contacto">
  <div class="wrap">
    <div class="contact-grid">
      <div class="contact-info reveal">
        <span class="eyebrow">Contacto</span>
        <h2>Agende su valoración cardíaca</h2>
        <p>Escríbanos con sus datos y le confirmaremos disponibilidad, o contáctenos directamente por WhatsApp para una respuesta más rápida.</p>
        <div class="info-list">
          <div class="info-item">
            <span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
            <div><div class="label">Consultorio</div><div class="val"><?php echo esc_html( $address ); ?></div></div>
          </div>
          <div class="info-item">
            <span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z"/></svg></span>
            <div><div class="label">Teléfono / WhatsApp</div><div class="val"><?php echo esc_html( $phone ); ?></div></div>
          </div>
          <div class="info-item">
            <span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span>
            <div><div class="label">Correo</div><div class="val"><?php echo esc_html( $email ); ?></div></div>
          </div>
          <div class="info-item">
            <span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></span>
            <div><div class="label">Horario</div><div class="val"><?php echo esc_html( $hours ); ?></div></div>
          </div>
        </div>
      </div>

      <div class="form-card reveal">
        <form id="contactForm">
          <div class="form-row">
            <div class="field">
              <label for="fname">Nombre completo</label>
              <input type="text" id="fname" name="fname" placeholder="Su nombre" required>
            </div>
            <div class="field">
              <label for="fphone">Teléfono</label>
              <input type="tel" id="fphone" name="fphone" placeholder="8888-8888" required>
            </div>
          </div>
          <div class="field">
            <label for="femail">Correo electrónico</label>
            <input type="email" id="femail" name="femail" placeholder="nombre@correo.com" required>
          </div>
          <div class="field">
            <label for="fservice">Estudio o consulta de interés</label>
            <select id="fservice" name="fservice">
              <option>Electrocardiograma</option>
              <option>Ecocardiograma</option>
              <option>Ergometría</option>
              <option>Holter</option>
              <option>MAPA</option>
              <option>Consulta prequirúrgica</option>
              <option>Valoración general</option>
            </select>
          </div>
          <div class="field">
            <label for="fmsg">Mensaje</label>
            <textarea id="fmsg" name="fmsg" placeholder="Cuéntenos brevemente qué necesita"></textarea>
          </div>
          <button type="submit" class="form-submit">
            Enviar solicitud
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
          <p class="form-error" id="formError"></p>
          <p class="form-note">Responderemos en menos de 24 horas hábiles.</p>
        </form>
        <div class="form-success" id="formSuccess">
          <div class="ic-check">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>
          </div>
          <h3 style="margin-bottom:8px;">Solicitud enviada</h3>
          <p style="color:var(--steel);font-size:14.5px;">Gracias por escribirnos. Nos pondremos en contacto pronto para confirmar su cita.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<?php get_footer(); ?>
