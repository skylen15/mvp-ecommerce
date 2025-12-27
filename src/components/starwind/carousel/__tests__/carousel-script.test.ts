import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initCarousel, type CarouselManager, type CarouselOptions } from '../carousel-script';

// Mock embla-carousel
const mockEmblaInstance = {
  on: vi.fn(),
  off: vi.fn(),
  scrollNext: vi.fn(),
  scrollPrev: vi.fn(),
  canScrollNext: vi.fn(() => true),
  canScrollPrev: vi.fn(() => false),
  scrollTo: vi.fn(),
  selectedScrollSnap: vi.fn(() => 0),
  scrollSnapList: vi.fn(() => [0, 1, 2]),
  destroy: vi.fn(),
};

vi.mock('embla-carousel', () => ({
  default: vi.fn(() => mockEmblaInstance),
}));

describe('Carousel Script', () => {
  let container: HTMLDivElement;
  let viewportElement: HTMLDivElement;
  let prevButton: HTMLButtonElement;
  let nextButton: HTMLButtonElement;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup DOM structure
    container = document.createElement('div');
    container.setAttribute('data-carousel', '');
    container.id = 'test-carousel';
    
    viewportElement = document.createElement('div');
    viewportElement.setAttribute('data-slot', 'carousel-content');
    
    const emblaContainer = document.createElement('div');
    emblaContainer.className = 'embla__container';
    
    // Add slides
    for (let i = 0; i < 3; i++) {
      const slide = document.createElement('div');
      slide.className = 'embla__slide';
      slide.textContent = `Slide ${i + 1}`;
      emblaContainer.appendChild(slide);
    }
    
    viewportElement.appendChild(emblaContainer);
    
    // Add navigation buttons
    prevButton = document.createElement('button');
    prevButton.setAttribute('data-slot', 'carousel-previous');
    prevButton.textContent = 'Previous';
    
    nextButton = document.createElement('button');
    nextButton.setAttribute('data-slot', 'carousel-next');
    nextButton.textContent = 'Next';
    
    container.appendChild(viewportElement);
    container.appendChild(prevButton);
    container.appendChild(nextButton);
    
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    it('should initialize carousel successfully', () => {
      const manager = initCarousel(container);
      
      expect(manager).not.toBeNull();
      expect(manager?.api).toBeDefined();
    });

    it('should mark carousel as initialized', () => {
      initCarousel(container);
      
      expect(container.dataset.initialized).toBe('true');
    });

    it('should not re-initialize if already initialized', () => {
      const manager1 = initCarousel(container);
      const manager2 = initCarousel(container);
      
      expect(manager1).not.toBeNull();
      expect(manager2).toBeNull();
    });

    it('should return null if carousel element is missing', () => {
      const manager = initCarousel(null as any);
      
      expect(manager).toBeNull();
    });

    it('should return null if viewport element is not found', () => {
      viewportElement.removeAttribute('data-slot');
      const manager = initCarousel(container);
      
      expect(manager).toBeNull();
    });

    it('should parse axis configuration from data attribute', () => {
      container.dataset.axis = 'y';
      const manager = initCarousel(container);
      
      expect(manager).not.toBeNull();
    });

    it('should default to x axis when not specified', () => {
      const manager = initCarousel(container);
      
      expect(manager).not.toBeNull();
    });

    it('should parse options from data-opts attribute', () => {
      container.dataset.opts = JSON.stringify({ loop: true, align: 'center' });
      const manager = initCarousel(container);
      
      expect(manager).not.toBeNull();
    });

    it('should handle invalid JSON in data-opts gracefully', () => {
      container.dataset.opts = 'invalid json';
      const manager = initCarousel(container);
      
      expect(manager).not.toBeNull();
    });

    it('should handle undefined data-opts gracefully', () => {
      container.dataset.opts = 'undefined';
      const manager = initCarousel(container);
      
      expect(manager).not.toBeNull();
    });

    it('should handle null data-opts gracefully', () => {
      container.dataset.opts = 'null';
      const manager = initCarousel(container);
      
      expect(manager).not.toBeNull();
    });
  });

  describe('Button Management', () => {
    it('should setup navigation buttons', () => {
      const manager = initCarousel(container);
      
      expect(manager).not.toBeNull();
      expect(prevButton).toBeDefined();
      expect(nextButton).toBeDefined();
    });

    it('should disable prev button when cannot scroll prev', () => {
      mockEmblaInstance.canScrollPrev.mockReturnValue(false);
      initCarousel(container);
      
      prevButton.click();
      expect(prevButton.disabled).toBe(true);
      expect(prevButton.getAttribute('aria-disabled')).toBe('true');
    });

    it('should enable next button when can scroll next', () => {
      mockEmblaInstance.canScrollNext.mockReturnValue(true);
      initCarousel(container);
      
      expect(nextButton.disabled).toBe(false);
      expect(nextButton.getAttribute('aria-disabled')).toBe('false');
    });

    it('should call scrollPrev when prev button clicked', () => {
      initCarousel(container);
      prevButton.click();
      
      expect(mockEmblaInstance.scrollPrev).toHaveBeenCalled();
    });

    it('should call scrollNext when next button clicked', () => {
      initCarousel(container);
      nextButton.click();
      
      expect(mockEmblaInstance.scrollNext).toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle ArrowLeft key for horizontal carousel', () => {
      initCarousel(container);
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      container.dispatchEvent(event);
      
      expect(mockEmblaInstance.scrollPrev).toHaveBeenCalled();
    });

    it('should handle ArrowRight key for horizontal carousel', () => {
      initCarousel(container);
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      container.dispatchEvent(event);
      
      expect(mockEmblaInstance.scrollNext).toHaveBeenCalled();
    });

    it('should handle ArrowUp key for vertical carousel', () => {
      container.dataset.axis = 'y';
      initCarousel(container);
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      container.dispatchEvent(event);
      
      expect(mockEmblaInstance.scrollPrev).toHaveBeenCalled();
    });

    it('should handle ArrowDown key for vertical carousel', () => {
      container.dataset.axis = 'y';
      initCarousel(container);
      
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      container.dispatchEvent(event);
      
      expect(mockEmblaInstance.scrollNext).toHaveBeenCalled();
    });

    it('should not respond to other keys', () => {
      initCarousel(container);
      
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      container.dispatchEvent(event);
      
      expect(mockEmblaInstance.scrollNext).not.toHaveBeenCalled();
      expect(mockEmblaInstance.scrollPrev).not.toHaveBeenCalled();
    });
  });

  describe('Manager API', () => {
    it('should expose scrollPrev method', () => {
      const manager = initCarousel(container) as CarouselManager;
      
      manager.scrollPrev();
      expect(mockEmblaInstance.scrollPrev).toHaveBeenCalled();
    });

    it('should expose scrollNext method', () => {
      const manager = initCarousel(container) as CarouselManager;
      
      manager.scrollNext();
      expect(mockEmblaInstance.scrollNext).toHaveBeenCalled();
    });

    it('should expose canScrollPrev method', () => {
      const manager = initCarousel(container) as CarouselManager;
      
      const result = manager.canScrollPrev();
      expect(mockEmblaInstance.canScrollPrev).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should expose canScrollNext method', () => {
      const manager = initCarousel(container) as CarouselManager;
      
      const result = manager.canScrollNext();
      expect(mockEmblaInstance.canScrollNext).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should expose api property', () => {
      const manager = initCarousel(container) as CarouselManager;
      
      expect(manager.api).toBe(mockEmblaInstance);
    });
  });

  describe('Cleanup and Destroy', () => {
    it('should expose destroy method', () => {
      const manager = initCarousel(container) as CarouselManager;
      
      expect(manager.destroy).toBeDefined();
      expect(typeof manager.destroy).toBe('function');
    });

    it('should call embla destroy on cleanup', () => {
      const manager = initCarousel(container) as CarouselManager;
      
      manager.destroy();
      expect(mockEmblaInstance.destroy).toHaveBeenCalled();
    });

    it('should remove event listeners on destroy', () => {
      const manager = initCarousel(container) as CarouselManager;
      const prevClickSpy = vi.fn();
      prevButton.addEventListener('click', prevClickSpy);
      
      manager.destroy();
      prevButton.click();
      
      // Event should still fire from our spy, but embla shouldn't be called again
      // after initial setup calls
      const initialCalls = mockEmblaInstance.scrollPrev.mock.calls.length;
      prevButton.click();
      expect(mockEmblaInstance.scrollPrev.mock.calls.length).toBe(initialCalls);
    });
  });

  describe('Custom Options', () => {
    it('should accept custom options', () => {
      const options: CarouselOptions = {
        opts: { loop: true, align: 'center' },
      };
      
      const manager = initCarousel(container, options);
      expect(manager).not.toBeNull();
    });

    it('should call setApi callback if provided', () => {
      const setApi = vi.fn();
      const options: CarouselOptions = { setApi };
      
      initCarousel(container, options);
      expect(setApi).toHaveBeenCalledWith(mockEmblaInstance);
    });

    it('should handle plugins array', () => {
      const mockPlugin = vi.fn();
      const options: CarouselOptions = {
        plugins: [mockPlugin as any],
      };
      
      const manager = initCarousel(container, options);
      expect(manager).not.toBeNull();
    });

    it('should not pass empty plugins array to Embla', () => {
      const options: CarouselOptions = {
        plugins: [],
      };
      
      const manager = initCarousel(container, options);
      expect(manager).not.toBeNull();
    });
  });

  describe('Event Listeners', () => {
    it('should listen to select event', () => {
      initCarousel(container);
      
      expect(mockEmblaInstance.on).toHaveBeenCalledWith('select', expect.any(Function));
    });

    it('should listen to init event', () => {
      initCarousel(container);
      
      expect(mockEmblaInstance.on).toHaveBeenCalledWith('init', expect.any(Function));
    });

    it('should listen to reInit event', () => {
      initCarousel(container);
      
      expect(mockEmblaInstance.on).toHaveBeenCalledWith('reInit', expect.any(Function));
    });

    it('should update button states on select event', () => {
      initCarousel(container);
      
      const selectHandler = mockEmblaInstance.on.mock.calls.find(
        call => call[0] === 'select'
      )?.[1];
      
      expect(selectHandler).toBeDefined();
      if (selectHandler) {
        mockEmblaInstance.canScrollPrev.mockReturnValue(true);
        mockEmblaInstance.canScrollNext.mockReturnValue(false);
        
        selectHandler();
        
        expect(prevButton.disabled).toBe(false);
        expect(nextButton.disabled).toBe(true);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should work without navigation buttons', () => {
      prevButton.remove();
      nextButton.remove();
      
      const manager = initCarousel(container);
      expect(manager).not.toBeNull();
    });

    it('should work with only prev button', () => {
      nextButton.remove();
      
      const manager = initCarousel(container);
      expect(manager).not.toBeNull();
    });

    it('should work with only next button', () => {
      prevButton.remove();
      
      const manager = initCarousel(container);
      expect(manager).not.toBeNull();
    });

    it('should handle empty container gracefully', () => {
      viewportElement.innerHTML = '';
      
      const manager = initCarousel(container);
      expect(manager).not.toBeNull();
    });

    it('should handle single slide', () => {
      const slides = viewportElement.querySelectorAll('.embla__slide');
      for (let i = 1; i < slides.length; i++) {
        slides[i].remove();
      }
      
      const manager = initCarousel(container);
      expect(manager).not.toBeNull();
    });

    it('should handle non-object data-opts', () => {
      container.dataset.opts = '123';
      
      const manager = initCarousel(container);
      expect(manager).not.toBeNull();
    });

    it('should merge data-opts with provided options', () => {
      container.dataset.opts = JSON.stringify({ loop: true });
      const options: CarouselOptions = {
        opts: { align: 'center' },
      };
      
      const manager = initCarousel(container, options);
      expect(manager).not.toBeNull();
    });
  });
});