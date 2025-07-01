import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, Users, Globe, Scissors, Heart, MapPin } from 'lucide-react';

const About: React.FC = () => {
  const navigate = useNavigate();
  const handleShopNow = () => {
    navigate('/collections');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            The LUXE Story
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the journey of LUXE, a brand dedicated to crafting timeless elegance with unparalleled craftsmanship.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                Our Beginnings
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2003, LUXE emerged from a vision to redefine luxury fashion. Our founder, Elise Moreau, sought to create garments that blend timeless design with modern sensibility, using only the finest materials sourced ethically from around the globe.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From a small atelier in Paris, LUXE has grown into a global brand, cherished by discerning clients who value quality and elegance. Our commitment to excellence remains unchanged, guiding every stitch and seam.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl opacity-10 blur-xl"></div>
              <img
                src="https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="LUXE Atelier"
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-3xl opacity-10 blur-xl"></div>
              <img
                src="https://images.pexels.com/photos/3731257/pexels-photo-3731257.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Craftsmanship"
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                Artisanal Craftsmanship
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At LUXE, every garment is a work of art. Our artisans, trained in traditional techniques, bring decades of expertise to each piece. From hand-stitched embroidery to custom-dyed fabrics, we honor the craft of couture.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We partner with family-owned workshops in Italy, India, and Japan, ensuring ethical production and preserving age-old crafts. This dedication to quality makes every LUXE piece a legacy item.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            LUXE is more than a brand—it’s a philosophy. We strive to empower our clients to express their individuality through clothing that exudes confidence and grace. Sustainability, inclusivity, and innovation are at the heart of everything we do.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Scissors className="text-amber-600 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                We use eco-friendly materials and ethical production to minimize our environmental impact.
              </p>
            </div>
            <div>
              <Heart className="text-amber-600 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusivity</h3>
              <p className="text-gray-600 text-sm">
                Our collections celebrate diverse styles, sizes, and stories, embracing all who wear LUXE.
              </p>
            </div>
            <div>
              <MapPin className="text-amber-600 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600 text-sm">
                From Paris to Tokyo, LUXE connects with clients in over 30 countries, sharing elegance worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="text-amber-600" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900">20+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-amber-600" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="text-amber-600" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900">30+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
            Join the LUXE Legacy
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our collections and become part of a story that celebrates elegance and craftsmanship.
          </p>
          <button
            onClick={handleShopNow}
            className="group bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-amber-600 transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Shop Now</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
